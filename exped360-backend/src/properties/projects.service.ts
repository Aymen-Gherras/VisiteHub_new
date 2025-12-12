import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { PropertyOwner, PropertyOwnerType } from './entities/property-owner.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(PropertyOwner)
    private propertyOwnerRepository: Repository<PropertyOwner>,
  ) {}

  // Create a new project
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Verify that the property owner exists and is a promoteur
    const propertyOwner = await this.propertyOwnerRepository.findOne({
      where: { id: createProjectDto.propertyOwnerId }
    });

    if (!propertyOwner) {
      throw new NotFoundException('Property owner not found');
    }

    if (propertyOwner.ownerType !== PropertyOwnerType.PROMOTEUR) {
      throw new ConflictException('Only promoteurs can have projects');
    }

    // Generate slug from name
    const slug = this.generateSlug(createProjectDto.name);
    
    // Check if name already exists
    const existingByName = await this.projectRepository.findOne({
      where: { name: createProjectDto.name }
    });
    if (existingByName) {
      throw new ConflictException('Project with this name already exists');
    }

    // Check if slug already exists
    const existingBySlug = await this.projectRepository.findOne({
      where: { slug }
    });
    if (existingBySlug) {
      throw new ConflictException('Project with this slug already exists');
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      slug,
      propertyOwner,
      startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : undefined,
      expectedCompletionDate: createProjectDto.expectedCompletionDate ? new Date(createProjectDto.expectedCompletionDate) : undefined,
    });

    return await this.projectRepository.save(project);
  }

  // Get all projects with optional filtering
  async findAll(status?: ProjectStatus, propertyOwnerId?: string): Promise<Project[]> {
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.propertyOwner', 'propertyOwner')
      .leftJoinAndSelect('project.properties', 'properties')
      .orderBy('project.createdAt', 'DESC');

    if (status) {
      query.andWhere('project.status = :status', { status });
    }

    if (propertyOwnerId) {
      query.andWhere('project.propertyOwnerId = :propertyOwnerId', { propertyOwnerId });
    }

    return await query.getMany();
  }

  // Get project by ID with relations
  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['propertyOwner', 'properties'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Get project by slug with relations
  async findBySlug(slug: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { slug },
      relations: ['propertyOwner', 'properties'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // Get projects by property owner
  async findByPropertyOwner(propertyOwnerId: string): Promise<Project[]> {
    return await this.findAll(undefined, propertyOwnerId);
  }

  // Update project
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // If name is being updated, regenerate slug
    if (updateProjectDto.name && updateProjectDto.name !== project.name) {
      const newSlug = this.generateSlug(updateProjectDto.name);
      
      // Check if new name already exists
      const existingByName = await this.projectRepository.findOne({
        where: { name: updateProjectDto.name }
      });
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException('Project with this name already exists');
      }

      // Check if new slug already exists
      const existingBySlug = await this.projectRepository.findOne({
        where: { slug: newSlug }
      });
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ConflictException('Project with this slug already exists');
      }

      updateProjectDto = { ...updateProjectDto, slug: newSlug };
    }

    // Handle date updates
    if (updateProjectDto.startDate) {
      updateProjectDto.startDate = new Date(updateProjectDto.startDate) as any;
    }
    if (updateProjectDto.expectedCompletionDate) {
      updateProjectDto.expectedCompletionDate = new Date(updateProjectDto.expectedCompletionDate) as any;
    }

    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  // Delete project
  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    
    // Check if project has properties
    if (project.properties?.length > 0) {
      throw new ConflictException('Cannot delete project with existing properties');
    }

    await this.projectRepository.remove(project);
  }

  // Get project statistics
  async getStatistics(id: string) {
    const project = await this.findOne(id);
    
    const stats = {
      totalProperties: project.properties?.length || 0,
      availableProperties: project.properties?.filter(p => !p.isFeatured).length || 0,
      soldProperties: project.totalUnits - project.availableUnits,
      completionPercentage: this.calculateCompletionPercentage(project),
    };

    return { project, stats };
  }

  // Update project units count
  async updateUnitsCount(id: string): Promise<Project> {
    const project = await this.findOne(id);
    
    // Count actual properties in the project
    const totalProperties = project.properties?.length || 0;
    
    // Update the project units
    project.totalUnits = totalProperties;
    // Keep availableUnits as is, or update based on business logic
    
    return await this.projectRepository.save(project);
  }

  // Helper method to calculate completion percentage
  private calculateCompletionPercentage(project: Project): number {
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

  // Helper method to generate URL-friendly slug
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }
}
