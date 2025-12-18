import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Promoteur } from './entities/promoteur.entity';
import { CreatePromoteurDto } from './dto/create-promoteur.dto';
import { UpdatePromoteurDto } from './dto/update-promoteur.dto';
import { Project } from '../projects/entities/project.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class PromoteursService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Promoteur)
    private promoteurRepository: Repository<Promoteur>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
  ) {}

  async create(createPromoteurDto: CreatePromoteurDto): Promise<Promoteur> {
    const existing = await this.promoteurRepository.findOne({
      where: [
        { name: createPromoteurDto.name },
        { slug: createPromoteurDto.slug },
      ],
    });

    if (existing) {
      throw new ConflictException('Promoteur with this name or slug already exists');
    }

    const promoteur = this.promoteurRepository.create(createPromoteurDto);
    return await this.promoteurRepository.save(promoteur);
  }

  async findAll(): Promise<Promoteur[]> {
    return await this.promoteurRepository
      .createQueryBuilder('promoteur')
      .loadRelationCountAndMap('promoteur.projectsCount', 'promoteur.projects')
      .orderBy('promoteur.name', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({ where: { id } });
    if (!promoteur) {
      throw new NotFoundException(`Promoteur with ID ${id} not found`);
    }
    return promoteur;
  }

  async findBySlug(slug: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({ where: { slug } });
    if (!promoteur) {
      throw new NotFoundException(`Promoteur with slug ${slug} not found`);
    }
    return promoteur;
  }

  async update(id: string, updatePromoteurDto: UpdatePromoteurDto): Promise<Promoteur> {
    const promoteur = await this.findOne(id);

    if (updatePromoteurDto.name || updatePromoteurDto.slug) {
      const existing = await this.promoteurRepository.findOne({
        where: [
          { name: updatePromoteurDto.name },
          { slug: updatePromoteurDto.slug },
        ],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Promoteur with this name or slug already exists');
      }
    }

    await this.promoteurRepository.update(id, updatePromoteurDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const promoteur = await this.findOne(id);

    await this.dataSource.transaction(async (manager) => {
      const projectRows = await manager
        .getRepository(Project)
        .createQueryBuilder('project')
        .select('project.id', 'id')
        .where('project.promoteurId = :promoteurId', { promoteurId: promoteur.id })
        .getRawMany<{ id: string }>();

      const projectIds = projectRows.map((row) => row.id).filter(Boolean);

      if (projectIds.length > 0) {
        await manager
          .getRepository(Property)
          .createQueryBuilder()
          .delete()
          .where('projectId IN (:...projectIds)', { projectIds })
          .execute();
      }

      // Also delete promotion-owned properties not attached to a project
      await manager.getRepository(Property).delete({
        propertyOwnerType: 'Promotion immobilière',
        propertyOwnerName: promoteur.name,
      });

      // This will cascade-delete projects via FK on Project.promoteurId
      await manager.getRepository(Promoteur).remove(promoteur);
    });
  }
}
