import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyOwner, PropertyOwnerType } from './entities/property-owner.entity';
import { Property } from './entities/property.entity';
import { CreatePropertyOwnerDto } from './dto/create-property-owner.dto';
import { UpdatePropertyOwnerDto } from './dto/update-property-owner.dto';

@Injectable()
export class PropertyOwnersService {
  constructor(
    @InjectRepository(PropertyOwner)
    private propertyOwnersRepository: Repository<PropertyOwner>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  /**
   * Generate a unique slug from name
   */
  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = name
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
      const existing = await this.propertyOwnersRepository.findOne({ 
        where: { slug }, 
        select: ['id'] 
      });
      if (!existing || (excludeId && existing.id === excludeId)) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async create(createPropertyOwnerDto: CreatePropertyOwnerDto): Promise<PropertyOwner> {
    const { slug, ...ownerData } = createPropertyOwnerDto;

    // Check if name already exists
    const existingByName = await this.propertyOwnersRepository.findOne({
      where: { name: ownerData.name }
    });
    if (existingByName) {
      throw new ConflictException(`Property owner with name "${ownerData.name}" already exists`);
    }

    // Generate slug if not provided
    const finalSlug = slug || await this.generateUniqueSlug(ownerData.name);

    const propertyOwner = this.propertyOwnersRepository.create({
      ...ownerData,
      slug: finalSlug,
    });

    return await this.propertyOwnersRepository.save(propertyOwner);
  }

  async findAll(): Promise<PropertyOwner[]> {
    return await this.propertyOwnersRepository.find({
      relations: ['properties', 'projects'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: PropertyOwnerType): Promise<PropertyOwner[]> {
    return await this.propertyOwnersRepository.find({
      where: { type },
      relations: ['properties', 'projects'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PropertyOwner> {
    const propertyOwner = await this.propertyOwnersRepository.findOne({
      where: { id },
      relations: ['properties', 'projects'],
    });

    if (!propertyOwner) {
      throw new NotFoundException(`Property owner with ID ${id} not found`);
    }

    return propertyOwner;
  }

  async findBySlug(slug: string): Promise<PropertyOwner> {
    const propertyOwner = await this.propertyOwnersRepository.findOne({
      where: { slug },
      relations: ['properties', 'projects'],
    });

    if (!propertyOwner) {
      throw new NotFoundException(`Property owner with slug "${slug}" not found`);
    }

    return propertyOwner;
  }

  async update(id: string, updatePropertyOwnerDto: UpdatePropertyOwnerDto): Promise<PropertyOwner> {
    const propertyOwner = await this.findOne(id);

    // Check if name is being changed and if it conflicts
    if (updatePropertyOwnerDto.name && updatePropertyOwnerDto.name !== propertyOwner.name) {
      const existingByName = await this.propertyOwnersRepository.findOne({
        where: { name: updatePropertyOwnerDto.name }
      });
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(`Property owner with name "${updatePropertyOwnerDto.name}" already exists`);
      }
    }

    // Generate new slug if name changed and slug not provided
    if (updatePropertyOwnerDto.name && !updatePropertyOwnerDto.slug) {
      updatePropertyOwnerDto.slug = await this.generateUniqueSlug(updatePropertyOwnerDto.name, id);
    }

    Object.assign(propertyOwner, updatePropertyOwnerDto);
    return await this.propertyOwnersRepository.save(propertyOwner);
  }

  async remove(id: string): Promise<void> {
    const propertyOwner = await this.findOne(id);
    
    // Check if there are associated properties
    const propertiesCount = await this.propertiesRepository.count({
      where: { propertyOwner: { id } }
    });

    if (propertiesCount > 0) {
      throw new ConflictException(
        `Cannot delete property owner. There are ${propertiesCount} properties associated with this owner.`
      );
    }

    await this.propertyOwnersRepository.remove(propertyOwner);
  }

  /**
   * Get properties for a specific property owner
   */
  async getProperties(ownerId: string): Promise<Property[]> {
    const propertyOwner = await this.findOne(ownerId);
    
    return await this.propertiesRepository.find({
      where: { propertyOwner: { id: ownerId } },
      relations: ['images', 'amenities', 'papers'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Migrate existing properties to new system
   * This will create PropertyOwner entities from existing propertyOwnerName values
   */
  async migrateExistingProperties(): Promise<{ created: number; linked: number }> {
    let created = 0;
    let linked = 0;

    // Get all unique property owner names for agences
    const agenceProperties = await this.propertiesRepository
      .createQueryBuilder('property')
      .select('DISTINCT property.propertyOwnerName', 'name')
      .where('property.propertyOwnerType = :type', { type: 'Agence immobilière' })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .andWhere('property.propertyOwnerName != ""')
      .getRawMany();

    // Create agence owners
    for (const { name } of agenceProperties) {
      const existing = await this.propertyOwnersRepository.findOne({ where: { name } });
      if (!existing) {
        const slug = await this.generateUniqueSlug(name);
        await this.propertyOwnersRepository.save(
          this.propertyOwnersRepository.create({
            name,
            slug,
            type: PropertyOwnerType.AGENCE,
          })
        );
        created++;
      }
    }

    // Get all unique property owner names for promoteurs
    const promoteurProperties = await this.propertiesRepository
      .createQueryBuilder('property')
      .select('DISTINCT property.propertyOwnerName', 'name')
      .where('property.propertyOwnerType = :type', { type: 'Promotion immobilière' })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .andWhere('property.propertyOwnerName != ""')
      .getRawMany();

    // Create promoteur owners
    for (const { name } of promoteurProperties) {
      const existing = await this.propertyOwnersRepository.findOne({ where: { name } });
      if (!existing) {
        const slug = await this.generateUniqueSlug(name);
        await this.propertyOwnersRepository.save(
          this.propertyOwnersRepository.create({
            name,
            slug,
            type: PropertyOwnerType.PROMOTEUR,
          })
        );
        created++;
      }
    }

    // Link existing properties to property owners
    const allOwners = await this.propertyOwnersRepository.find();
    for (const owner of allOwners) {
      const ownerType = owner.type === PropertyOwnerType.AGENCE ? 'Agence immobilière' : 'Promotion immobilière';
      
      const properties = await this.propertiesRepository.find({
        where: {
          propertyOwnerType: ownerType,
          propertyOwnerName: owner.name,
          propertyOwner: null, // Only update properties that haven't been linked yet
        }
      });

      for (const property of properties) {
        property.propertyOwner = owner;
        await this.propertiesRepository.save(property);
        linked++;
      }
    }

    return { created, linked };
  }
}
