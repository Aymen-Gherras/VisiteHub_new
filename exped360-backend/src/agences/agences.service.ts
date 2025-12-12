import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agence } from './entities/agence.entity';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';

@Injectable()
export class AgencesService {
  constructor(
    @InjectRepository(Agence)
    private readonly agenceRepository: Repository<Agence>,
  ) {}

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

  async create(createAgenceDto: CreateAgenceDto): Promise<Agence> {
    // Check if agence with same name already exists
    const existingAgence = await this.agenceRepository.findOne({
      where: { name: createAgenceDto.name }
    });

    if (existingAgence) {
      throw new ConflictException('Agence with this name already exists');
    }

    // Generate slug
    const baseSlug = this.slugify(createAgenceDto.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await this.agenceRepository.findOne({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const agence = this.agenceRepository.create({
      ...createAgenceDto,
      slug,
    });

    return await this.agenceRepository.save(agence);
  }

  async findAll(): Promise<Agence[]> {
    return await this.agenceRepository.find({
      relations: ['properties'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({
      where: { id },
      relations: ['properties']
    });

    if (!agence) {
      throw new NotFoundException('Agence not found');
    }

    return agence;
  }

  async findBySlug(slug: string): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({
      where: { slug },
      relations: ['properties']
    });

    if (!agence) {
      throw new NotFoundException('Agence not found');
    }

    return agence;
  }

  async update(id: string, updateAgenceDto: UpdateAgenceDto): Promise<Agence> {
    const agence = await this.findOne(id);

    // If name is being updated, check for conflicts and update slug
    if (updateAgenceDto.name && updateAgenceDto.name !== agence.name) {
      const existingAgence = await this.agenceRepository.findOne({
        where: { name: updateAgenceDto.name }
      });

      if (existingAgence && existingAgence.id !== id) {
        throw new ConflictException('Agence with this name already exists');
      }

      // Generate new slug
      const baseSlug = this.slugify(updateAgenceDto.name);
      let slug = baseSlug;
      let counter = 1;

      while (await this.agenceRepository.findOne({ where: { slug } })) {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      updateAgenceDto = { ...updateAgenceDto, slug } as any;
    }

    await this.agenceRepository.update(id, updateAgenceDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const agence = await this.findOne(id);
    await this.agenceRepository.remove(agence);
  }

  async getAgenceStats(id: string) {
    const agence = await this.findOne(id);
    
    const stats = await this.agenceRepository
      .createQueryBuilder('agence')
      .leftJoin('agence.properties', 'property')
      .select([
        'COUNT(DISTINCT property.id) as propertiesCount',
        'COUNT(DISTINCT CASE WHEN property.transactionType = "vendre" THEN property.id END) as salePropertiesCount',
        'COUNT(DISTINCT CASE WHEN property.transactionType = "location" THEN property.id END) as rentPropertiesCount',
        'COUNT(DISTINCT CASE WHEN property.isFeatured = true THEN property.id END) as featuredPropertiesCount'
      ])
      .where('agence.id = :id', { id })
      .getRawOne();

    return {
      ...stats,
      propertiesCount: parseInt(stats.propertiesCount) || 0,
      salePropertiesCount: parseInt(stats.salePropertiesCount) || 0,
      rentPropertiesCount: parseInt(stats.rentPropertiesCount) || 0,
      featuredPropertiesCount: parseInt(stats.featuredPropertiesCount) || 0
    };
  }
}
