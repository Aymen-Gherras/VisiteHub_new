import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Promoteur } from '../entities/promoteur.entity';
import { CreatePromoteurDto } from '../dto/create-promoteur.dto';
import { UpdatePromoteurDto } from '../dto/update-promoteur.dto';

@Injectable()
export class PromoteursService {
  private readonly logger = new Logger(PromoteursService.name);

  constructor(
    @InjectRepository(Promoteur)
    private promoteurRepository: Repository<Promoteur>,
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

  async create(createPromoteurDto: CreatePromoteurDto): Promise<Promoteur> {
    // Check if name already exists
    const existingByName = await this.promoteurRepository.findOne({
      where: { name: createPromoteurDto.name }
    });
    if (existingByName) {
      throw new ConflictException('A promoteur with this name already exists');
    }

    // Generate slug if not provided
    const slug = createPromoteurDto.slug || this.generateSlug(createPromoteurDto.name);
    
    // Check if slug already exists
    const existingBySlug = await this.promoteurRepository.findOne({
      where: { slug }
    });
    if (existingBySlug) {
      throw new ConflictException('A promoteur with this slug already exists');
    }

    const promoteur = this.promoteurRepository.create({
      ...createPromoteurDto,
      slug,
    });

    const savedPromoteur = await this.promoteurRepository.save(promoteur);
    this.logger.log(`Created promoteur: ${savedPromoteur.name}`);
    return savedPromoteur;
  }

  async findAll(options?: {
    search?: string;
    wilaya?: string;
    featured?: boolean;
    active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Promoteur[]; total: number }> {
    const queryBuilder = this.promoteurRepository
      .createQueryBuilder('promoteur')
      .leftJoinAndSelect('promoteur.projects', 'projects')
      .leftJoinAndSelect('promoteur.properties', 'properties')
      .where('promoteur.isActive = :active', { active: options?.active ?? true });

    if (options?.search) {
      queryBuilder.andWhere(
        '(promoteur.name LIKE :search OR promoteur.description LIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    if (options?.wilaya) {
      queryBuilder.andWhere('promoteur.wilaya = :wilaya', { wilaya: options.wilaya });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('promoteur.isFeatured = :featured', { featured: options.featured });
    }

    queryBuilder.orderBy('promoteur.isFeatured', 'DESC')
      .addOrderBy('promoteur.createdAt', 'DESC');

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({
      where: { id, isActive: true },
      relations: ['projects', 'properties']
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    // Increment view count
    await this.promoteurRepository.increment({ id }, 'viewCount', 1);

    return promoteur;
  }

  async findBySlug(slug: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({
      where: { slug, isActive: true },
      relations: ['projects', 'properties']
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    // Increment view count
    await this.promoteurRepository.increment({ id: promoteur.id }, 'viewCount', 1);

    return promoteur;
  }

  async findByName(name: string): Promise<Promoteur | null> {
    return this.promoteurRepository.findOne({
      where: { name }
    });
  }

  async update(id: string, updatePromoteurDto: UpdatePromoteurDto): Promise<Promoteur> {
    const promoteur = await this.findOne(id);

    // Check name uniqueness if name is being updated
    if (updatePromoteurDto.name && updatePromoteurDto.name !== promoteur.name) {
      const existingByName = await this.promoteurRepository.findOne({
        where: { name: updatePromoteurDto.name }
      });
      if (existingByName) {
        throw new ConflictException('A promoteur with this name already exists');
      }
    }

    // Generate new slug if name is updated
    if (updatePromoteurDto.name) {
      updatePromoteurDto.slug = this.generateSlug(updatePromoteurDto.name);
    }

    // Check slug uniqueness if slug is being updated
    if (updatePromoteurDto.slug && updatePromoteurDto.slug !== promoteur.slug) {
      const existingBySlug = await this.promoteurRepository.findOne({
        where: { slug: updatePromoteurDto.slug }
      });
      if (existingBySlug) {
        throw new ConflictException('A promoteur with this slug already exists');
      }
    }

    Object.assign(promoteur, updatePromoteurDto);
    const updatedPromoteur = await this.promoteurRepository.save(promoteur);
    
    this.logger.log(`Updated promoteur: ${updatedPromoteur.name}`);
    return updatedPromoteur;
  }

  async remove(id: string): Promise<void> {
    const promoteur = await this.findOne(id);
    
    // Soft delete by setting isActive to false
    promoteur.isActive = false;
    await this.promoteurRepository.save(promoteur);
    
    this.logger.log(`Soft deleted promoteur: ${promoteur.name}`);
  }

  async getPromoteurStats(id: string) {
    const promoteur = await this.promoteurRepository.findOne({
      where: { id },
      relations: ['projects', 'properties']
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    const activeProjects = promoteur.projects?.filter(p => p.isActive) || [];
    const completedProjects = activeProjects.filter(p => p.status === 'completed');
    const ongoingProjects = activeProjects.filter(p => p.status === 'construction');
    
    const totalProperties = promoteur.properties?.length || 0;
    const availableProperties = promoteur.properties?.filter(p => p.transactionType === 'vendre').length || 0;

    return {
      totalProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      ongoingProjects: ongoingProjects.length,
      totalProperties,
      availableProperties,
      soldProperties: totalProperties - availableProperties,
      viewCount: promoteur.viewCount,
    };
  }

  async getFeatured(limit: number = 6): Promise<Promoteur[]> {
    return this.promoteurRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['projects', 'properties'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getPopular(limit: number = 6): Promise<Promoteur[]> {
    return this.promoteurRepository.find({
      where: { isActive: true },
      relations: ['projects', 'properties'],
      order: { viewCount: 'DESC' },
      take: limit,
    });
  }

  async searchByLocation(wilaya: string, daira?: string): Promise<Promoteur[]> {
    const where: FindOptionsWhere<Promoteur> = {
      isActive: true,
      wilaya,
    };

    if (daira) {
      where.daira = daira;
    }

    return this.promoteurRepository.find({
      where,
      relations: ['projects', 'properties'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStatistics() {
    const [
      totalPromoteurs,
      activePromoteurs,
      featuredPromoteurs,
      totalProjects,
      totalProperties
    ] = await Promise.all([
      this.promoteurRepository.count(),
      this.promoteurRepository.count({ where: { isActive: true } }),
      this.promoteurRepository.count({ where: { isFeatured: true, isActive: true } }),
      this.promoteurRepository
        .createQueryBuilder('promoteur')
        .leftJoin('promoteur.projects', 'project')
        .select('COUNT(project.id)', 'count')
        .where('promoteur.isActive = :active', { active: true })
        .getRawOne(),
      this.promoteurRepository
        .createQueryBuilder('promoteur')
        .leftJoin('promoteur.properties', 'property')
        .select('COUNT(property.id)', 'count')
        .where('promoteur.isActive = :active', { active: true })
        .getRawOne(),
    ]);

    return {
      totalPromoteurs,
      activePromoteurs,
      featuredPromoteurs,
      totalProjects: parseInt(totalProjects?.count || '0'),
      totalProperties: parseInt(totalProperties?.count || '0'),
    };
  }
}
