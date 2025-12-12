import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Agence } from '../entities/agence.entity';
import { CreateAgenceDto } from '../dto/create-agence.dto';
import { UpdateAgenceDto } from '../dto/update-agence.dto';

@Injectable()
export class AgencesService {
  private readonly logger = new Logger(AgencesService.name);

  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(createAgenceDto: CreateAgenceDto): Promise<Agence> {
    // Check if name already exists
    const existingByName = await this.agenceRepository.findOne({
      where: { name: createAgenceDto.name }
    });
    if (existingByName) {
      throw new ConflictException('An agence with this name already exists');
    }

    // Generate slug if not provided
    const slug = createAgenceDto.slug || this.generateSlug(createAgenceDto.name);
    
    // Check if slug already exists
    const existingBySlug = await this.agenceRepository.findOne({
      where: { slug }
    });
    if (existingBySlug) {
      throw new ConflictException('An agence with this slug already exists');
    }

    // Convert date string to Date object if provided
    const agenceData = {
      ...createAgenceDto,
      slug,
      licenseExpiry: createAgenceDto.licenseExpiry ? new Date(createAgenceDto.licenseExpiry) : undefined,
    };

    const agence = this.agenceRepository.create(agenceData);
    const savedAgence = await this.agenceRepository.save(agence);
    
    this.logger.log(`Created agence: ${savedAgence.name}`);
    return savedAgence;
  }

  async findAll(options?: {
    search?: string;
    wilaya?: string;
    featured?: boolean;
    active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Agence[]; total: number }> {
    const queryBuilder = this.agenceRepository
      .createQueryBuilder('agence')
      .leftJoinAndSelect('agence.properties', 'properties')
      .where('agence.isActive = :active', { active: options?.active ?? true });

    if (options?.search) {
      queryBuilder.andWhere(
        '(agence.name LIKE :search OR agence.description LIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    if (options?.wilaya) {
      queryBuilder.andWhere('agence.wilaya = :wilaya', { wilaya: options.wilaya });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('agence.isFeatured = :featured', { featured: options.featured });
    }

    queryBuilder.orderBy('agence.isFeatured', 'DESC')
      .addOrderBy('agence.rating', 'DESC')
      .addOrderBy('agence.createdAt', 'DESC');

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({
      where: { id, isActive: true },
      relations: ['properties']
    });

    if (!agence) {
      throw new NotFoundException('Agence not found');
    }

    // Increment view count
    await this.agenceRepository.increment({ id }, 'viewCount', 1);

    return agence;
  }

  async findBySlug(slug: string): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({
      where: { slug, isActive: true },
      relations: ['properties']
    });

    if (!agence) {
      throw new NotFoundException('Agence not found');
    }

    // Increment view count
    await this.agenceRepository.increment({ id: agence.id }, 'viewCount', 1);

    return agence;
  }

  async findByName(name: string): Promise<Agence | null> {
    return this.agenceRepository.findOne({
      where: { name }
    });
  }

  async update(id: string, updateAgenceDto: UpdateAgenceDto): Promise<Agence> {
    const agence = await this.findOne(id);

    // Check name uniqueness if name is being updated
    if (updateAgenceDto.name && updateAgenceDto.name !== agence.name) {
      const existingByName = await this.agenceRepository.findOne({
        where: { name: updateAgenceDto.name }
      });
      if (existingByName) {
        throw new ConflictException('An agence with this name already exists');
      }
    }

    // Generate new slug if name is updated
    if (updateAgenceDto.name) {
      updateAgenceDto.slug = this.generateSlug(updateAgenceDto.name);
    }

    // Check slug uniqueness if slug is being updated
    if (updateAgenceDto.slug && updateAgenceDto.slug !== agence.slug) {
      const existingBySlug = await this.agenceRepository.findOne({
        where: { slug: updateAgenceDto.slug }
      });
      if (existingBySlug) {
        throw new ConflictException('An agence with this slug already exists');
      }
    }

    // Convert date string to Date object if provided
    const updateData = {
      ...updateAgenceDto,
      licenseExpiry: updateAgenceDto.licenseExpiry ? new Date(updateAgenceDto.licenseExpiry) : agence.licenseExpiry,
    };

    Object.assign(agence, updateData);
    const updatedAgence = await this.agenceRepository.save(agence);
    
    this.logger.log(`Updated agence: ${updatedAgence.name}`);
    return updatedAgence;
  }

  async remove(id: string): Promise<void> {
    const agence = await this.findOne(id);
    
    // Soft delete by setting isActive to false
    agence.isActive = false;
    await this.agenceRepository.save(agence);
    
    this.logger.log(`Soft deleted agence: ${agence.name}`);
  }

  async getAgenceStats(id: string) {
    const agence = await this.agenceRepository.findOne({
      where: { id },
      relations: ['properties']
    });

    if (!agence) {
      throw new NotFoundException('Agence not found');
    }

    const totalProperties = agence.properties?.length || 0;
    const saleProperties = agence.properties?.filter(p => p.transactionType === 'vendre').length || 0;
    const rentProperties = agence.properties?.filter(p => p.transactionType === 'location').length || 0;
    const featuredProperties = agence.properties?.filter(p => p.isFeatured).length || 0;

    // Calculate recent properties (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProperties = agence.properties?.filter(p => p.createdAt >= thirtyDaysAgo).length || 0;

    return {
      totalProperties,
      saleProperties,
      rentProperties,
      featuredProperties,
      recentProperties,
      rating: agence.rating,
      reviewCount: agence.reviewCount,
      viewCount: agence.viewCount,
    };
  }

  async getFeatured(limit: number = 6): Promise<Agence[]> {
    return this.agenceRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['properties'],
      order: { rating: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async getTopRated(limit: number = 6): Promise<Agence[]> {
    return this.agenceRepository.find({
      where: { isActive: true },
      relations: ['properties'],
      order: { rating: 'DESC', reviewCount: 'DESC' },
      take: limit,
    });
  }

  async searchByLocation(wilaya: string, daira?: string): Promise<Agence[]> {
    const where: FindOptionsWhere<Agence> = {
      isActive: true,
      wilaya,
    };

    if (daira) {
      where.daira = daira;
    }

    return this.agenceRepository.find({
      where,
      relations: ['properties'],
      order: { rating: 'DESC', createdAt: 'DESC' },
    });
  }

  async updateRating(id: string, newRating: number): Promise<Agence> {
    const agence = await this.findOne(id);
    
    // Simple rating update - in a real system, you'd calculate from reviews
    const totalRating = (agence.rating * agence.reviewCount) + newRating;
    agence.reviewCount += 1;
    agence.rating = totalRating / agence.reviewCount;

    return this.agenceRepository.save(agence);
  }

  async getStatistics() {
    const [
      totalAgences,
      activeAgences,
      featuredAgences,
      totalProperties,
      averageRating
    ] = await Promise.all([
      this.agenceRepository.count(),
      this.agenceRepository.count({ where: { isActive: true } }),
      this.agenceRepository.count({ where: { isFeatured: true, isActive: true } }),
      this.agenceRepository
        .createQueryBuilder('agence')
        .leftJoin('agence.properties', 'property')
        .select('COUNT(property.id)', 'count')
        .where('agence.isActive = :active', { active: true })
        .getRawOne(),
      this.agenceRepository
        .createQueryBuilder('agence')
        .select('AVG(agence.rating)', 'avgRating')
        .where('agence.isActive = :active AND agence.reviewCount > 0', { active: true })
        .getRawOne(),
    ]);

    return {
      totalAgences,
      activeAgences,
      featuredAgences,
      totalProperties: parseInt(totalProperties?.count || '0'),
      averageRating: parseFloat(averageRating?.avgRating || '0'),
    };
  }
}
