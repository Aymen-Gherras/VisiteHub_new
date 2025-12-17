import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('promoteurs/:promoteurId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Param('promoteurId') promoteurId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(promoteurId, createProjectDto);
  }

  @Get()
  findAll(@Param('promoteurId') promoteurId: string) {
    return this.projectsService.findAllForPromoteur(promoteurId);
  }

  @Get(':projectId')
  findOne(
    @Param('promoteurId') promoteurId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.findOne(promoteurId, projectId);
  }

  @Patch(':projectId')
  update(
    @Param('promoteurId') promoteurId: string,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(promoteurId, projectId, updateProjectDto);
  }

  @Delete(':projectId')
  remove(
    @Param('promoteurId') promoteurId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.remove(promoteurId, projectId);
  }
}
