import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { Promoteur } from '../entities/promoteur.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
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

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Verify promoteur exists
    const promoteur = await this.promoteurRepository.findOne({
      where: { id: createProjectDto.promoteurId, isActive: true }
    });
    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    // Check if name already exists
    const existingByName = await this.projectRepository.findOne({
      where: { name: createProjectDto.name }
    });
    if (existingByName) {
      throw new ConflictException('A project with this name already exists');
    }

    // Generate slug if not provided
    const slug = createProjectDto.slug || this.generateSlug(createProjectDto.name);
    
    // Check if slug already exists
    const existingBySlug = await this.projectRepository.findOne({
      where: { slug }
    });
    if (existingBySlug) {
      throw new ConflictException('A project with this slug already exists');
    }

    // Convert date strings to Date objects
    const projectData = {
      ...createProjectDto,
      slug,
      promoteur,
      startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : undefined,
      expectedCompletionDate: createProjectDto.expectedCompletionDate ? new Date(createProjectDto.expectedCompletionDate) : undefined,
      actualCompletionDate: createProjectDto.actualCompletionDate ? new Date(createProjectDto.actualCompletionDate) : undefined,
    };

    const project = this.projectRepository.create(projectData);
    const savedProject = await this.projectRepository.save(project);
    
    this.logger.log(`Created project: ${savedProject.name} for promoteur: ${promoteur.name}`);
    return savedProject;
  }

  async findAll(options?: {
    search?: string;
    wilaya?: string;
    status?: ProjectStatus;
    promoteurId?: string;
    featured?: boolean;
    active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Project[]; total: number }> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.promoteur', 'promoteur')
      .leftJoinAndSelect('project.properties', 'properties')
      .where('project.isActive = :active', { active: options?.active ?? true });

    if (options?.search) {
      queryBuilder.andWhere(
        '(project.name LIKE :search OR project.description LIKE :search OR project.location LIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    if (options?.wilaya) {
      queryBuilder.andWhere('project.wilaya = :wilaya', { wilaya: options.wilaya });
    }

    if (options?.status) {
      queryBuilder.andWhere('project.status = :status', { status: options.status });
    }

    if (options?.promoteurId) {
      queryBuilder.andWhere('project.promoteurId = :promoteurId', { promoteurId: options.promoteurId });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('project.isFeatured = :featured', { featured: options.featured });
    }

    queryBuilder.orderBy('project.isFeatured', 'DESC')
      .addOrderBy('project.createdAt', 'DESC');

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findByPromoteur(promoteurId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { promoteur: { id: promoteurId }, isActive: true },
      relations: ['promoteur', 'properties'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, isActive: true },
      relations: ['promoteur', 'properties']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Increment view count
    await this.projectRepository.increment({ id }, 'viewCount', 1);

    return project;
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { slug, isActive: true },
      relations: ['promoteur', 'properties']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Increment view count
    await this.projectRepository.increment({ id: project.id }, 'viewCount', 1);

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // Check name uniqueness if name is being updated
    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      const existingByName = await this.projectRepository.findOne({
        where: { name: updateProjectDto.name }
      });
      if (existingByName) {
        throw new ConflictException('A project with this name already exists');
      }
    }

    // Generate new slug if name is updated
    if (updateProjectDto.name) {
      updateProjectDto.slug = this.generateSlug(updateProjectDto.name);
    }

    // Check slug uniqueness if slug is being updated
    if (updateProjectDto.slug && updateProjectDto.slug !== project.slug) {
      const existingBySlug = await this.projectRepository.findOne({
        where: { slug: updateProjectDto.slug }
      });
      if (existingBySlug) {
        throw new ConflictException('A project with this slug already exists');
      }
    }

    // Handle date updates
    const updateData = {
      ...updateProjectDto,
      startDate: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : project.startDate,
      expectedCompletionDate: updateProjectDto.expectedCompletionDate ? new Date(updateProjectDto.expectedCompletionDate) : project.expectedCompletionDate,
      actualCompletionDate: updateProjectDto.actualCompletionDate ? new Date(updateProjectDto.actualCompletionDate) : project.actualCompletionDate,
    };

    Object.assign(project, updateData);
    const updatedProject = await this.projectRepository.save(project);
    
    this.logger.log(`Updated project: ${updatedProject.name}`);
    return updatedProject;
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    
    // Soft delete by setting isActive to false
    project.isActive = false;
    await this.projectRepository.save(project);
    
    this.logger.log(`Soft deleted project: ${project.name}`);
  }

  async getProjectStats(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['properties']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const totalProperties = project.properties?.length || 0;
    const availableProperties = project.properties?.filter(p => p.transactionType === 'vendre').length || 0;
    const soldProperties = totalProperties - availableProperties;

    return {
      totalUnits: project.totalUnits,
      availableUnits: project.availableUnits,
      soldUnits: project.soldUnits,
      propertiesCount: totalProperties,
      availableProperties,
      soldProperties,
      completionPercentage: this.calculateCompletionPercentage(project),
      viewCount: project.viewCount,
      daysRemaining: this.calculateDaysRemaining(project),
    };
  }

  private calculateCompletionPercentage(project: Project): number {
    if (project.completionPercentage > 0) {
      return project.completionPercentage;
    }

    if (!project.startDate || !project.expectedCompletionDate) {
      return 0;
    }

    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.expectedCompletionDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    return Math.round((elapsed / totalDuration) * 100);
  }

  private calculateDaysRemaining(project: Project): number | null {
    if (!project.expectedCompletionDate || project.status === 'completed') {
      return null;
    }

    const now = new Date();
    const end = new Date(project.expectedCompletionDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }

  async getFeatured(limit: number = 6): Promise<Project[]> {
    return this.projectRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['promoteur', 'properties'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getByStatus(status: ProjectStatus, limit?: number): Promise<Project[]> {
    const options: any = {
      where: { status, isActive: true },
      relations: ['promoteur', 'properties'],
      order: { createdAt: 'DESC' },
    };

    if (limit) {
      options.take = limit;
    }

    return this.projectRepository.find(options);
  }

  async searchByLocation(wilaya: string, daira?: string): Promise<Project[]> {
    const where: FindOptionsWhere<Project> = {
      isActive: true,
      wilaya,
    };

    if (daira) {
      where.daira = daira;
    }

    return this.projectRepository.find({
      where,
      relations: ['promoteur', 'properties'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateProgress(id: string, completionPercentage: number): Promise<Project> {
    const project = await this.findOne(id);
    
    project.completionPercentage = Math.min(100, Math.max(0, completionPercentage));
    
    // Auto-update status based on completion
    if (completionPercentage >= 100) {
      project.status = ProjectStatus.COMPLETED;
      if (!project.actualCompletionDate) {
        project.actualCompletionDate = new Date();
      }
    } else if (completionPercentage > 0) {
      project.status = ProjectStatus.CONSTRUCTION;
    }

    return this.projectRepository.save(project);
  }

  async getStatistics() {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      ongoingProjects,
      plannedProjects,
      totalProperties
    ] = await Promise.all([
      this.projectRepository.count(),
      this.projectRepository.count({ where: { isActive: true } }),
      this.projectRepository.count({ where: { status: ProjectStatus.COMPLETED, isActive: true } }),
      this.projectRepository.count({ where: { status: ProjectStatus.CONSTRUCTION, isActive: true } }),
      this.projectRepository.count({ where: { status: ProjectStatus.PLANNING, isActive: true } }),
      this.projectRepository
        .createQueryBuilder('project')
        .leftJoin('project.properties', 'property')
        .select('COUNT(property.id)', 'count')
        .where('project.isActive = :active', { active: true })
        .getRawOne(),
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      ongoingProjects,
      plannedProjects,
      totalProperties: parseInt(totalProperties?.count || '0'),
    };
  }
}
