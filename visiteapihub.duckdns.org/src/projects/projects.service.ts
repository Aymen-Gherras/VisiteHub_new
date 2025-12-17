import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Promoteur } from '../promoteurs/entities/promoteur.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Promoteur)
    private readonly promoteursRepository: Repository<Promoteur>,
  ) {}

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(promoteurId: string, dto: CreateProjectDto): Promise<Project> {
    const promoteur = await this.promoteursRepository.findOne({ where: { id: promoteurId } });
    if (!promoteur) throw new NotFoundException('Promoteur not found');

    const project = this.projectsRepository.create({
      promoteurId,
      name: dto.name,
      slug: (dto.slug && dto.slug.trim() ? dto.slug : this.slugify(dto.name)),
      description: dto.description,
      wilaya: dto.wilaya ?? '',
      daira: dto.daira ?? '',
      address: dto.address,
      floorsCount: dto.floorsCount,
      unitsPerFloor: dto.unitsPerFloor,
    });

    return this.projectsRepository.save(project);
  }

  async findAllForPromoteur(promoteurId: string): Promise<Project[]> {
    const promoteur = await this.promoteursRepository.findOne({ where: { id: promoteurId } });
    if (!promoteur) throw new NotFoundException('Promoteur not found');

    return this.projectsRepository.find({
      where: { promoteurId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(promoteurId: string, projectId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id: projectId, promoteurId } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(promoteurId: string, projectId: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(promoteurId, projectId);

    if (dto.name) {
      project.name = dto.name;
      project.slug = (dto.slug && dto.slug.trim() ? dto.slug : this.slugify(dto.name));
    }

    if (dto.slug !== undefined) project.slug = dto.slug;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.wilaya !== undefined) project.wilaya = dto.wilaya ?? '';
    if (dto.daira !== undefined) project.daira = dto.daira ?? '';
    if (dto.address !== undefined) project.address = dto.address;
    if (dto.floorsCount !== undefined) project.floorsCount = dto.floorsCount;
    if (dto.unitsPerFloor !== undefined) project.unitsPerFloor = dto.unitsPerFloor;

    return this.projectsRepository.save(project);
  }

  async remove(promoteurId: string, projectId: string): Promise<void> {
    const project = await this.findOne(promoteurId, projectId);
    await this.projectsRepository.remove(project);
  }
}
