import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promoteur } from './entities/promoteur.entity';
import { CreatePromoteurDto } from './dto/create-promoteur.dto';
import { UpdatePromoteurDto } from './dto/update-promoteur.dto';

@Injectable()
export class PromoteursService {
  constructor(
    @InjectRepository(Promoteur)
    private readonly promoteurRepository: Repository<Promoteur>,
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

  async create(createPromoteurDto: CreatePromoteurDto): Promise<Promoteur> {
    // Check if promoteur with same name already exists
    const existingPromoteur = await this.promoteurRepository.findOne({
      where: { name: createPromoteurDto.name }
    });

    if (existingPromoteur) {
      throw new ConflictException('Promoteur with this name already exists');
    }

    // Generate slug
    const baseSlug = this.slugify(createPromoteurDto.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await this.promoteurRepository.findOne({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const promoteur = this.promoteurRepository.create({
      ...createPromoteurDto,
      slug,
    });

    return await this.promoteurRepository.save(promoteur);
  }

  async findAll(): Promise<Promoteur[]> {
    return await this.promoteurRepository.find({
      relations: ['projects', 'properties'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({
      where: { id },
      relations: ['projects', 'properties']
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    return promoteur;
  }

  async findBySlug(slug: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({
      where: { slug },
      relations: ['projects', 'properties']
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    return promoteur;
  }

  async update(id: string, updatePromoteurDto: UpdatePromoteurDto): Promise<Promoteur> {
    const promoteur = await this.findOne(id);

    // If name is being updated, check for conflicts and update slug
    if (updatePromoteurDto.name && updatePromoteurDto.name !== promoteur.name) {
      const existingPromoteur = await this.promoteurRepository.findOne({
        where: { name: updatePromoteurDto.name }
      });

      if (existingPromoteur && existingPromoteur.id !== id) {
        throw new ConflictException('Promoteur with this name already exists');
      }

      // Generate new slug
      const baseSlug = this.slugify(updatePromoteurDto.name);
      let slug = baseSlug;
      let counter = 1;

      while (await this.promoteurRepository.findOne({ where: { slug } })) {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      updatePromoteurDto = { ...updatePromoteurDto, slug } as any;
    }

    await this.promoteurRepository.update(id, updatePromoteurDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const promoteur = await this.findOne(id);
    await this.promoteurRepository.remove(promoteur);
  }

  async getPromoteurStats(id: string) {
    const promoteur = await this.findOne(id);
    
    const stats = await this.promoteurRepository
      .createQueryBuilder('promoteur')
      .leftJoin('promoteur.projects', 'project')
      .leftJoin('promoteur.properties', 'property')
      .select([
        'COUNT(DISTINCT project.id) as projectsCount',
        'COUNT(DISTINCT property.id) as propertiesCount',
        'COUNT(DISTINCT CASE WHEN project.status = "completed" THEN project.id END) as completedProjectsCount',
        'COUNT(DISTINCT CASE WHEN project.status = "construction" THEN project.id END) as activeProjectsCount'
      ])
      .where('promoteur.id = :id', { id })
      .getRawOne();

    return {
      ...stats,
      projectsCount: parseInt(stats.projectsCount) || 0,
      propertiesCount: parseInt(stats.propertiesCount) || 0,
      completedProjectsCount: parseInt(stats.completedProjectsCount) || 0,
      activeProjectsCount: parseInt(stats.activeProjectsCount) || 0
    };
  }
}
