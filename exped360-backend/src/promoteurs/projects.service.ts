import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Promoteur } from './entities/promoteur.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
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

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Verify promoteur exists
    const promoteur = await this.promoteurRepository.findOne({
      where: { id: createProjectDto.promoteurId }
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    // Check if project with same name already exists
    const existingProject = await this.projectRepository.findOne({
      where: { name: createProjectDto.name }
    });

    if (existingProject) {
      throw new ConflictException('Project with this name already exists');
    }

    // Generate slug
    const baseSlug = this.slugify(createProjectDto.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await this.projectRepository.findOne({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      slug,
      promoteur,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['promoteur', 'properties'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByPromoteur(promoteurId: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { promoteur: { id: promoteurId } },
      relations: ['promoteur', 'properties'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['promoteur', 'properties']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { slug },
      relations: ['promoteur', 'properties']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // If promoteurId is being updated, verify the new promoteur exists
    if (updateProjectDto.promoteurId && updateProjectDto.promoteurId !== project.promoteur.id) {
      const promoteur = await this.promoteurRepository.findOne({
        where: { id: updateProjectDto.promoteurId }
      });

      if (!promoteur) {
        throw new NotFoundException('Promoteur not found');
      }
    }

    // If name is being updated, check for conflicts and update slug
    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      const existingProject = await this.projectRepository.findOne({
        where: { name: updateProjectDto.name }
      });

      if (existingProject && existingProject.id !== id) {
        throw new ConflictException('Project with this name already exists');
      }

      // Generate new slug
      const baseSlug = this.slugify(updateProjectDto.name);
      let slug = baseSlug;
      let counter = 1;

      while (await this.projectRepository.findOne({ where: { slug } })) {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }

      updateProjectDto = { ...updateProjectDto, slug } as any;
    }

    await this.projectRepository.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async getProjectStats(id: string) {
    const project = await this.findOne(id);
    
    const stats = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.properties', 'property')
      .select([
        'COUNT(DISTINCT property.id) as propertiesCount',
        'COUNT(DISTINCT CASE WHEN property.transactionType = "vendre" THEN property.id END) as salePropertiesCount',
        'COUNT(DISTINCT CASE WHEN property.transactionType = "location" THEN property.id END) as rentPropertiesCount'
      ])
      .where('project.id = :id', { id })
      .getRawOne();

    return {
      ...stats,
      propertiesCount: parseInt(stats.propertiesCount) || 0,
      salePropertiesCount: parseInt(stats.salePropertiesCount) || 0,
      rentPropertiesCount: parseInt(stats.rentPropertiesCount) || 0
    };
  }
}
