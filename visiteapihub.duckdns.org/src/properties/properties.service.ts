import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CacheInvalidationService } from '../common/services/cache-invalidation.service';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Paper } from './entities/paper.entity';
import { FeaturedProperty } from './entities/featured-property.entity';
import { HomepageSettings } from '../site-settings/entities/homepage-settings.entity';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFiltersDto } from './dto/property-filters.dto';

// Type for the transformed property that matches frontend expectations
type TransformedProperty = Omit<Property, 'nearbyPlaces'> & {
  images: string[];
  papers: string[];
  nearbyPlaces?: Array<{
    id: string;
    name: string;
    distance: string;
    icon: string;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(Paper)
    private paperRepository: Repository<Paper>,
    @InjectRepository(FeaturedProperty)
    private featuredRepository: Repository<FeaturedProperty>,
    @InjectRepository(HomepageSettings)
    private settingsRepository: Repository<HomepageSettings>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private cacheInvalidationService: CacheInvalidationService,
  ) { }

  /**
   * Generate a unique slug from property title
   */
  private async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    // Keep incrementing until unique
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.propertiesRepository.findOne({ where: { slug }, select: ['id'] });
      if (!existing || (excludeId && existing.id === excludeId)) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async getStats(): Promise<{ totalProperties: number; activeListings: number; totalValue: number }> {
    const raw = await this.propertiesRepository
      .createQueryBuilder('p')
      .select('COUNT(p.id)', 'totalProperties')
      .addSelect(
        "COALESCE(SUM(CAST(NULLIF(REPLACE(REPLACE(p.price, ' ', ''), ',', ''), '') AS DECIMAL(18,2))), 0)",
        'totalValue',
      )
      .getRawOne<{ totalProperties?: string | number; totalValue?: string | number }>();

    const totalProperties = Number(raw?.totalProperties ?? 0);
    const totalValue = Number(raw?.totalValue ?? 0);

    // No explicit listing-status field exists yet; treat all properties as active.
    const activeListings = totalProperties;

    return { totalProperties, activeListings, totalValue: Math.round(totalValue) };
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<TransformedProperty> {
    const {
      imageUrls,
      images,
      mainImage,
      papers: paperNames,
      slug,
      price,
      ...propertyData
    } = createPropertyDto;

    const normalizedImages = Array.isArray(images)
      ? images
      : Array.isArray(imageUrls)
        ? imageUrls
        : [];

    const normalizedPapers = Array.isArray(paperNames)
      ? paperNames.map((p) => String(p).trim()).filter(Boolean)
      : [];

    // CRITICAL: Extract price and save it separately using raw SQL
    const priceValue = price ? (typeof price === 'string' ? price : String(price)) : undefined;

    // Lazy slug generation: if not provided, generate from title
    const finalSlug = slug || (propertyData.title ? await this.generateUniqueSlug(propertyData.title) : undefined);

    // Upsert papers into papers table (kept), while storing the names directly on properties.papers (JSON)
    if (normalizedPapers.length > 0) {
      for (const name of normalizedPapers) {
        const existing = await this.paperRepository.findOne({ where: { name } });
        if (!existing) {
          await this.paperRepository.save(this.paperRepository.create({ name }));
        }
      }
    }

    const property = this.propertiesRepository.create({
      ...propertyData,
      slug: finalSlug,
      price: priceValue || '', // Temporary value, will be updated via raw SQL
      mainImage: mainImage || undefined,
      images: normalizedImages,
      papers: normalizedPapers,
    });

    const savedProperty = await this.propertiesRepository.save(property);

    // CRITICAL: Update price using raw SQL to bypass TypeORM transformations
    if (priceValue !== undefined) {
      const queryRunner = this.propertiesRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();

      try {
        await queryRunner.query('UPDATE properties SET price = ? WHERE id = ?', [priceValue, savedProperty.id]);
        console.log('✅ PropertiesService.create - Price updated via RAW SQL:', priceValue);
      } finally {
        await queryRunner.release();
      }
    }

    const result = await this.findOne(savedProperty.id);
    await this.invalidatePropertyCache(savedProperty.id);
    return result;
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<{ properties: TransformedProperty[], total: number }> {
    // Note: Caching is disabled on the controller endpoint via @DisableCache decorator
    // This ensures fresh data is always returned after create/update/delete operations

    // Use query builder for efficient count (avoids full table scan)
    const countQueryBuilder = this.propertiesRepository.createQueryBuilder('property');
    const total = await countQueryBuilder.getCount();

    // Use query builder for efficient pagination
    // Try with nearbyPlaces first, fall back without it if table doesn't exist
    let properties: Property[];
    try {
      const queryBuilder = this.propertiesRepository.createQueryBuilder('property');
      queryBuilder.leftJoinAndSelect('property.nearbyPlaces', 'nearbyPlaces');

      // Add pagination
      queryBuilder.skip(offset).take(limit);

      // Order by creation date (newest first)
      queryBuilder.orderBy('property.createdAt', 'DESC');

      properties = await queryBuilder.getMany();
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in findAll query:', error?.message || error);
      console.error('Error code:', error?.code);
      console.error('SQL Message:', error?.sqlMessage);

      // If error is about nearby_places table/column issues, retry without it
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      const errorString = JSON.stringify(error).toLowerCase();

      // Check for various error indicators related to nearby_places
      if (this.isNearbyPlacesError(error)) {
        console.log('⚠️ nearby_places related error detected, retrying query without it');
        try {
          const queryBuilder = this.propertiesRepository.createQueryBuilder('property');

          // Add pagination
          queryBuilder.skip(offset).take(limit);

          // Order by creation date (newest first)
          queryBuilder.orderBy('property.createdAt', 'DESC');

          properties = await queryBuilder.getMany();
        } catch (fallbackError: any) {
          console.error('Fallback query also failed:', fallbackError?.message || fallbackError);
          throw fallbackError;
        }
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    // Transform properties efficiently
    const transformedProperties = properties.map((property) => this.transformProperty(property));

    const result = { properties: transformedProperties, total };

    // No caching - always return fresh data (cache disabled on endpoint)

    return result;
  }

  // Helper function to check if error is related to nearby_places
  private isNearbyPlacesError(error: any): boolean {
    const errorMessage = String(error?.message || '').toLowerCase();
    const errorCode = String(error?.code || '').toLowerCase();
    const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
    const errorString = JSON.stringify(error).toLowerCase();

    return (
      errorMessage.includes('nearby_places') ||
      errorMessage.includes('nearbyplaces') ||
      errorMessage.includes('displayorder') ||
      errorMessage.includes('display_order') ||
      errorMessage.includes('doesn\'t exist') ||
      errorMessage.includes('unknown column') ||
      (errorMessage.includes('table') && errorMessage.includes('exist')) ||
      errorCode === 'er_no_such_table' ||
      errorCode === 'er_bad_field_error' || // Unknown column error
      errorCode === '42s02' ||
      sqlMessage.includes('nearby_places') ||
      sqlMessage.includes('nearbyplaces') ||
      sqlMessage.includes('displayorder') ||
      sqlMessage.includes('display_order') ||
      sqlMessage.includes('doesn\'t exist') ||
      sqlMessage.includes('unknown column') ||
      errorString.includes('nearby_places') ||
      errorString.includes('nearbyplaces') ||
      errorString.includes('displayorder')
    );
  }

  async findOne(id: string): Promise<TransformedProperty> {
    // Try with nearbyPlaces first, fall back without it if table/column issues
    let property: Property | null;
    try {
      property = await this.propertiesRepository.findOne({
        where: { id },
        relations: ['nearbyPlaces'],
      });
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in findOne query:', error?.message || error);
      console.error('Error code:', error?.code);
      console.error('SQL Message:', error?.sqlMessage);

      // If error is about nearby_places table/column issues, retry without it
      if (this.isNearbyPlacesError(error)) {
        console.log('⚠️ nearby_places related error detected, retrying query without it');
        property = await this.propertiesRepository.findOne({
          where: { id },
          relations: [],
        });
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Transform the property to match frontend expectations
    // Use transformProperty to ensure price is always a string
    return this.transformProperty(property);
  }

  private transformProperty(property: Property): TransformedProperty {
    // Ensure price is always a string when transforming
    const transformed = {
      ...property,
      price: String(property.price), // Force to string - preserve full value like "1 milliards"
      images: Array.isArray(property.images) ? property.images : [],
      papers: Array.isArray(property.papers) ? property.papers : [],
      nearbyPlaces: property.nearbyPlaces ? property.nearbyPlaces.map(np => ({
        id: np.id,
        name: np.name,
        distance: np.distance,
        icon: np.icon || '📍',
        displayOrder: np.displayOrder,
        createdAt: np.createdAt,
        updatedAt: np.updatedAt,
      })).sort((a, b) => a.displayOrder - b.displayOrder) : [],
    } as TransformedProperty;

    console.log('🔍 transformProperty - Price:', transformed.price, 'Type:', typeof transformed.price, 'Original:', property.price);
    return transformed;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<TransformedProperty> {
    const { imageUrls, images, mainImage, viewCount, papers: paperNames, ...propertyData } = updatePropertyDto;

    // Log the price value received
    console.log('🔍 PropertiesService.update - Received price:', propertyData.price, 'Type:', typeof propertyData.price);

    // Get the raw property first
    const property = await this.propertiesRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // If title changed and slug not explicitly provided, lazily generate
    if (propertyData.title && !propertyData.slug) {
      propertyData.slug = await this.generateUniqueSlug(propertyData.title, id);
    }

    // CRITICAL: Handle price separately using RAW SQL to bypass ALL TypeORM transformations
    if (propertyData.price !== undefined) {
      const priceValue = typeof propertyData.price === 'string' ? propertyData.price : String(propertyData.price);
      console.log('🔍 PropertiesService.update - Price value to save:', priceValue, 'Type:', typeof priceValue, 'Length:', priceValue.length);

      // Use RAW SQL query to directly update price in database, completely bypassing TypeORM
      // This ensures the string is saved exactly as-is, even if the column type is wrong
      const queryRunner = this.propertiesRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();

      try {
        // Use parameterized query to prevent SQL injection
        const result = await queryRunner.query(
          'UPDATE properties SET price = ? WHERE id = ?',
          [priceValue, id]
        );

        console.log('✅ PropertiesService.update - Price updated via RAW SQL. Affected rows:', result.affectedRows || result.changedRows || 0);

        // Verify by reading directly from database
        const verifyResult = await queryRunner.query(
          'SELECT price FROM properties WHERE id = ?',
          [id]
        );

        if (verifyResult && verifyResult.length > 0) {
          const dbPrice = verifyResult[0].price;
          console.log('🔍 PropertiesService.update - Verified price from RAW SQL query:', dbPrice, 'Type:', typeof dbPrice, 'Length:', dbPrice?.length);
          property.price = String(dbPrice); // Ensure it's a string
        }
      } finally {
        await queryRunner.release();
      }

      // Remove price from propertyData so it doesn't get overwritten
      delete propertyData.price;
    }

    // Update the property (excluding viewCount unless explicitly provided)
    Object.assign(property, propertyData);

    // Only update viewCount if it's explicitly provided in the request
    if (viewCount !== undefined) {
      property.viewCount = viewCount;
    }

    // Handle images + main image if provided
    const nextImages = Array.isArray(images)
      ? images
      : Array.isArray(imageUrls)
        ? imageUrls
        : undefined;

    if (nextImages !== undefined) {
      property.images = nextImages;
    }

    if (typeof mainImage === 'string') {
      property.mainImage = mainImage || undefined;
    }

    // Save the property (price already updated via query builder)
    const updatedProperty = await this.propertiesRepository.save(property);
    console.log('🔍 PropertiesService.update - Property price after save:', updatedProperty.price, 'Type:', typeof updatedProperty.price, 'Length:', updatedProperty.price?.length);

    // Update papers if provided
    if (Array.isArray(paperNames)) {
      const normalized = paperNames.map((p) => String(p).trim()).filter(Boolean);
      if (normalized.length > 0) {
        for (const name of normalized) {
          const existing = await this.paperRepository.findOne({ where: { name } });
          if (!existing) {
            await this.paperRepository.save(this.paperRepository.create({ name }));
          }
        }
      }

      updatedProperty.papers = normalized;
      await this.propertiesRepository.save(updatedProperty);
    }

    // Return the updated property with images (transformed)
    // CRITICAL: Reload property directly from database to verify price was saved correctly
    const directDbProperty = await this.propertiesRepository
      .createQueryBuilder('property')
      .where('property.id = :id', { id })
      .select(['property.id', 'property.price'])
      .getRawOne();

    console.log('🔍 PropertiesService.update - Direct DB query result:', directDbProperty);
    console.log('🔍 PropertiesService.update - Price from direct DB query:', directDbProperty?.property_price, 'Type:', typeof directDbProperty?.property_price);

    const result = await this.findOne(id);
    console.log('🔍 PropertiesService.update - Result from findOne - Price:', result.price, 'Type:', typeof result.price);

    // Invalidate cache after updating property
    await this.invalidatePropertyCache(id);

    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Invalidate cache after deleting property
    await this.invalidatePropertyCache(id);
  }

  async findByFilters(filters: PropertyFiltersDto): Promise<{ properties: TransformedProperty[], total: number }> {
    // Note: Caching is disabled on the controller endpoint via @DisableCache decorator
    // This ensures fresh data is always returned after create/update/delete operations

    // Helper function to build query with all filters applied
    const buildQuery = (includeNearbyPlaces: boolean = true) => {
      const queryBuilder = this.propertiesRepository.createQueryBuilder('property');
      if (includeNearbyPlaces) {
        queryBuilder.leftJoinAndSelect('property.nearbyPlaces', 'nearbyPlaces');
      }

      // Property type filter
      if (filters.type) {
        queryBuilder.andWhere('property.type = :type', { type: filters.type });
      }

      // Transaction type filter
      if (filters.transactionType) {
        queryBuilder.andWhere('property.transactionType = :transactionType', {
          transactionType: filters.transactionType,
        });
      }

      // Price range filters - convert string prices to numbers for comparison
      if (filters.minPrice) {
        queryBuilder.andWhere(
          'CAST(REPLACE(REPLACE(property.price, ",", ""), " ", "") AS UNSIGNED) >= :minPrice',
          { minPrice: filters.minPrice }
        );
      }

      if (filters.maxPrice) {
        queryBuilder.andWhere(
          'CAST(REPLACE(REPLACE(property.price, ",", ""), " ", "") AS UNSIGNED) <= :maxPrice',
          { maxPrice: filters.maxPrice }
        );
      }

      // Bedrooms range filters
      if (filters.minBedrooms) {
        queryBuilder.andWhere('property.bedrooms >= :minBedrooms', { minBedrooms: filters.minBedrooms });
      }

      if (filters.maxBedrooms) {
        queryBuilder.andWhere('property.bedrooms <= :maxBedrooms', { maxBedrooms: filters.maxBedrooms });
      }

      // Bathrooms range filters
      if (filters.minBathrooms) {
        queryBuilder.andWhere('property.bathrooms >= :minBathrooms', { minBathrooms: filters.minBathrooms });
      }

      if (filters.maxBathrooms) {
        queryBuilder.andWhere('property.bathrooms <= :maxBathrooms', { maxBathrooms: filters.maxBathrooms });
      }

      // Surface range filters
      if (filters.minSurface) {
        queryBuilder.andWhere('property.surface >= :minSurface', { minSurface: filters.minSurface });
      }

      if (filters.maxSurface) {
        queryBuilder.andWhere('property.surface <= :maxSurface', { maxSurface: filters.maxSurface });
      }

      // Location filters
      if (filters.wilaya) {
        queryBuilder.andWhere('LOWER(property.wilaya) LIKE LOWER(:wilaya)', { wilaya: `%${filters.wilaya}%` });
      }

      if (filters.daira) {
        queryBuilder.andWhere('LOWER(property.daira) LIKE LOWER(:daira)', { daira: `%${filters.daira}%` });
      }

      // Property owner type filter
      if (filters.propertyOwnerType) {
        queryBuilder.andWhere('property.propertyOwnerType = :propertyOwnerType', { propertyOwnerType: filters.propertyOwnerType });
      }

      // Property owner name filter (agency/promotion company name)
      if ((filters as any).propertyOwnerName) {
        queryBuilder.andWhere('property.propertyOwnerName = :propertyOwnerName', {
          propertyOwnerName: (filters as any).propertyOwnerName,
        });
      }

      // Project filter (promotion project)
      if ((filters as any).projectId) {
        queryBuilder.andWhere('property.projectId = :projectId', { projectId: (filters as any).projectId });
      }

      // 360° Tour filter
      if (filters.has360Tour !== undefined) {
        if (filters.has360Tour) {
          queryBuilder.andWhere('property.iframe360Link IS NOT NULL AND property.iframe360Link != ""');
        } else {
          queryBuilder.andWhere('(property.iframe360Link IS NULL OR property.iframe360Link = "")');
        }
      }

      // Featured filter
      if (typeof (filters as any).isFeatured === 'boolean') {
        queryBuilder.andWhere('property.isFeatured = :isFeatured', { isFeatured: (filters as any).isFeatured });
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            // Convert string price to number for sorting
            queryBuilder.orderBy('CAST(REPLACE(REPLACE(property.price, ",", ""), " ", "") AS UNSIGNED)', 'ASC');
            break;
          case 'price_desc':
            // Convert string price to number for sorting
            queryBuilder.orderBy('CAST(REPLACE(REPLACE(property.price, ",", ""), " ", "") AS UNSIGNED)', 'DESC');
            break;
          case 'surface_asc':
            queryBuilder.orderBy('property.surface', 'ASC');
            break;
          case 'surface_desc':
            queryBuilder.orderBy('property.surface', 'DESC');
            break;
          case 'newest':
            queryBuilder.orderBy('property.createdAt', 'DESC');
            break;
          case 'oldest':
            queryBuilder.orderBy('property.createdAt', 'ASC');
            break;
          case 'most_viewed':
            queryBuilder.orderBy('property.viewCount', 'DESC');
            break;
          default:
            queryBuilder.orderBy('property.createdAt', 'DESC');
        }
      } else {
        queryBuilder.orderBy('property.createdAt', 'DESC');
      }

      return queryBuilder;
    };

    // Try with nearbyPlaces first, fall back without it if table doesn't exist
    let properties: Property[];
    let total: number;
    try {
      const queryBuilder = buildQuery(true);
      total = await queryBuilder.getCount();

      // Pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      queryBuilder.skip(offset).take(limit);

      properties = await queryBuilder.getMany();
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in findByFilters query:', error?.message || error);
      console.error('Error code:', error?.code);
      console.error('SQL Message:', error?.sqlMessage);

      // Check for various error indicators related to nearby_places
      if (this.isNearbyPlacesError(error)) {
        console.log('⚠️ nearby_places related error detected, retrying query without it');
        try {
          // Retry without nearbyPlaces join
          const fallbackQueryBuilder = buildQuery(false);
          total = await fallbackQueryBuilder.getCount();

          // Pagination
          const limit = filters.limit || 20;
          const offset = filters.offset || 0;
          fallbackQueryBuilder.skip(offset).take(limit);

          properties = await fallbackQueryBuilder.getMany();
        } catch (fallbackError: any) {
          console.error('Fallback query also failed:', fallbackError?.message || fallbackError);
          throw fallbackError;
        }
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    // Transform properties
    const transformedProperties = properties.map((property) => this.transformProperty(property));

    const result = { properties: transformedProperties, total };

    // No caching - always return fresh data (cache disabled on endpoint)

    return result;
  }

  async incrementView(id: string): Promise<{ viewCount: number }> {
    const property = await this.propertiesRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    property.viewCount = (property.viewCount || 0) + 1;
    await this.propertiesRepository.save(property);
    return { viewCount: property.viewCount };
  }

  /** Find property by slug */
  async findBySlug(slug: string): Promise<TransformedProperty> {
    // Try with nearbyPlaces first, fall back without it if table doesn't exist
    let property: Property | null = null;
    try {
      // Try exact slug
      property = await this.propertiesRepository.findOne({ where: { slug }, relations: ['nearbyPlaces'] });
      // Try normalized slug
      if (!property) {
        const normalized = this.slugify(slug);
        if (normalized && normalized !== slug) {
          property = await this.propertiesRepository.findOne({ where: { slug: normalized }, relations: ['nearbyPlaces'] });
        }
      }
      // Try as ID fallback
      if (!property) {
        property = await this.propertiesRepository.findOne({ where: { id: slug }, relations: ['nearbyPlaces'] });
      }
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in findBySlug query:', error?.message || error);

      // If error is about nearby_places table/column issues, retry without it
      if (this.isNearbyPlacesError(error)) {
        console.log('⚠️ nearby_places related error detected, retrying query without it');
        // Try exact slug
        property = await this.propertiesRepository.findOne({ where: { slug }, relations: [] });
        // Try normalized slug
        if (!property) {
          const normalized = this.slugify(slug);
          if (normalized && normalized !== slug) {
            property = await this.propertiesRepository.findOne({ where: { slug: normalized }, relations: [] });
          }
        }
        // Try as ID fallback
        if (!property) {
          property = await this.propertiesRepository.findOne({ where: { id: slug }, relations: [] });
        }
      } else {
        // Re-throw other errors
        throw error;
      }
    }
    if (!property) throw new NotFoundException(`Property with slug ${slug} not found`);
    return this.transformProperty(property);
  }

  /** Return ordered featured properties capped by settings.maxFeatured */
  async findFeatured(): Promise<TransformedProperty[]> {
    try {
      const settings = await this.settingsRepository.findOne({ where: {} });
      const max = settings?.maxFeatured ?? 6;
      const links = await this.featuredRepository.find({ order: { position: 'ASC', createdAt: 'ASC' } });
      const limited = links.slice(0, max);
      if (limited.length === 0) return [];
      const ids = limited.map(l => l.propertyId);
      let props: Property[] = [];
      try {
        props = await this.propertiesRepository.find({
          where: { id: In(ids) },
          relations: ['nearbyPlaces'],
        });
      } catch (error: any) {
        if (this.isNearbyPlacesError(error)) {
          console.log('⚠️ nearby_places related error detected in findFeatured, retrying without it');
          props = await this.propertiesRepository.find({ where: { id: In(ids) } });
        } else {
          throw error;
        }
      }
      // preserve order
      const map = new Map(props.map(p => [p.id, p]));
      const ordered = ids.map(id => map.get(id)).filter(Boolean) as Property[];
      return ordered.map((p) => this.transformProperty(p));
    } catch (error) {
      console.error('Error in findFeatured:', error);
      return [];
    }
  }

  /** Admin: list featured with positions */
  async listFeaturedAdmin(): Promise<Array<{ property: TransformedProperty; position: number }>> {
    const links = await this.featuredRepository.find({ order: { position: 'ASC', createdAt: 'ASC' } });
    const ids = links.map(l => l.propertyId);
    if (ids.length === 0) return [];
    const props = await this.propertiesRepository.find({ where: { id: In(ids) } });
    const map = new Map(props.map(p => [p.id, p]));
    return links.map(l => {
      const p = map.get(l.propertyId);
      if (!p) return null as any;
      return { property: this.transformProperty(p), position: l.position };
    }).filter(Boolean);
  }

  /** Admin: add property to featured set; respects settings.maxFeatured */
  async addFeatured(propertyRef: string): Promise<{ success: true }> {
    // Accept either ID or slug
    let exists = await this.propertiesRepository.findOne({ where: { id: propertyRef }, select: ['id'] });
    if (!exists) {
      exists = await this.propertiesRepository.findOne({ where: { slug: propertyRef }, select: ['id'] });
    }
    if (!exists) throw new NotFoundException('Property not found');
    const propertyId = exists.id;
    const already = await this.featuredRepository.findOne({ where: { propertyId } });
    if (already) return { success: true }; // idempotent
    const settings = await this.settingsRepository.findOne({ where: {} });
    const max = settings?.maxFeatured ?? 6;
    const count = await this.featuredRepository.count();
    if (count >= max) throw new BadRequestException('Maximum featured reached');
    const next = count + 1;
    await this.featuredRepository.save(this.featuredRepository.create({ propertyId, position: next }));

    // Keep properties.isFeatured in sync for admin list/filter convenience
    await this.propertiesRepository.update({ id: propertyId }, { isFeatured: true } as any);
    // Invalidate cache
    await this.invalidatePropertyCache(propertyId);
    return { success: true };
  }

  /** Admin: remove property from featured set and compact positions */
  async removeFeatured(propertyId: string): Promise<{ success: true }> {
    const link = await this.featuredRepository.findOne({ where: { propertyId } });
    if (!link) return { success: true };
    const removedPos = link.position;
    await this.featuredRepository.delete({ propertyId });
    // shift down positions above removed
    const higher = await this.featuredRepository.find({ where: {}, order: { position: 'ASC' } });
    for (const l of higher) {
      if (l.position > removedPos) {
        await this.featuredRepository.update({ id: l.id }, { position: l.position - 1 });
      }
    }
    // Invalidate cache
    await this.invalidatePropertyCache(propertyId);

    // Keep properties.isFeatured in sync
    await this.propertiesRepository.update({ id: propertyId }, { isFeatured: false } as any);
    return { success: true };
  }

  /** Admin: reorder featured set by provided positions */
  async reorderFeatured(items: Array<{ propertyId: string; position: number }>): Promise<{ success: true }> {
    const orderMap = new Map<string, number>();
    items.forEach((row, idx) => {
      const pos = typeof row.position === 'number' ? row.position : idx + 1;
      orderMap.set(row.propertyId, pos);
    });
    const all = await this.featuredRepository.find({ order: { position: 'ASC', createdAt: 'ASC' } });
    // Ensure continuous positions based on provided list order; others keep their relative order after
    let nextPos = 1;
    // First assign for provided items maintaining their relative order by provided position asc then idx
    const providedIds = Array.from(orderMap.entries()).sort((a, b) => a[1] - b[1]).map(([id]) => id);
    for (const pid of providedIds) {
      const row = all.find(r => r.propertyId === pid);
      if (row) {
        await this.featuredRepository.update({ id: row.id }, { position: nextPos++ });
      }
    }
    // Then assign the rest
    for (const row of all) {
      if (!orderMap.has(row.propertyId)) {
        await this.featuredRepository.update({ id: row.id }, { position: nextPos++ });
      }
    }
    // Invalidate cache
    await this.invalidatePropertyCache();
    return { success: true };
  }

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /** Toggle featured membership in the ordered featured set (respects settings.maxFeatured). */
  async toggleFeatured(id: string): Promise<TransformedProperty> {
    // Try with nearbyPlaces first, fall back without it if table doesn't exist
    let property: Property | null;
    try {
      property = await this.propertiesRepository.findOne({ where: { id }, relations: ['nearbyPlaces'] });
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in toggleFeatured query:', error?.message || error);

      // If error is about nearby_places table/column issues, retry without it
      if (this.isNearbyPlacesError(error)) {
        console.log('⚠️ nearby_places related error detected, retrying query without it');
        property = await this.propertiesRepository.findOne({ where: { id }, relations: [] });
      } else {
        // Re-throw other errors
        throw error;
      }
    }
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Decide based on membership in featured_properties (single source of truth)
    const existingLink = await this.featuredRepository.findOne({ where: { propertyId: id } });

    if (existingLink) {
      // Unfeature: remove from featured set + compact positions
      await this.removeFeatured(id);
      await this.propertiesRepository.update({ id }, { isFeatured: false } as any);
    } else {
      // Feature: add to featured set (cap by settings.maxFeatured)
      const settings = await this.settingsRepository.findOne({ where: {} });
      const max = settings?.maxFeatured ?? 6;
      const count = await this.featuredRepository.count();
      if (count >= max) {
        throw new BadRequestException(`Maximum of ${max} featured properties allowed`);
      }
      await this.featuredRepository.save(this.featuredRepository.create({ propertyId: id, position: count + 1 }));
      await this.propertiesRepository.update({ id }, { isFeatured: true } as any);
    }

    // Reload property after updates
    const saved = await this.propertiesRepository.findOne({ where: { id }, relations: ['nearbyPlaces'] }).catch(async (error: any) => {
      if (this.isNearbyPlacesError(error)) {
        console.log('⚠️ nearby_places related error detected, retrying query without it');
        return this.propertiesRepository.findOne({ where: { id }, relations: [] });
      }
      throw error;
    });

    if (!saved) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Invalidate cache after toggling featured status
    await this.invalidatePropertyCache();

    return this.transformProperty(saved);
  }

  /**
   * Invalidate all property-related cache entries
   * This should be called after create, update, or delete operations
   */
  private async invalidatePropertyCache(propertyId?: string): Promise<void> {
    try {
      // Invalidate known manual cache keys
      const keysToDelete = [
        'properties:featured',
      ];

      // Delete known cache keys
      for (const key of keysToDelete) {
        try {
          await this.cacheManager.del(key);
        } catch (error) {
          // Ignore individual deletion errors
        }
      }

      // Invalidate route-based cache (from global CacheInterceptor)
      // This is critical - it invalidates the GET /api/properties cache
      if (propertyId) {
        await this.cacheInvalidationService.invalidateProperty(propertyId);
      } else {
        await this.cacheInvalidationService.invalidateProperties();
      }

      // Manual cache keys are no longer used (caching disabled on list endpoints)
      // But we still invalidate route-based cache from SmartCacheInterceptor

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Cache invalidated for property${propertyId ? ` ${propertyId}` : 's'}`);
      }
    } catch (error) {
      // Ignore cache invalidation errors - don't fail the operation
      // Log only in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Cache invalidation failed:', error);
      }
    }
  }
}