import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Admin endpoints (protected)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/update-units')
  @UseGuards(JwtAuthGuard)
  updateUnitsCount(@Param('id') id: string) {
    return this.projectsService.updateUnitsCount(id);
  }

  // Public endpoints (no auth required)
  @Get()
  findAll(
    @Query('status') status?: ProjectStatus,
    @Query('propertyOwnerId') propertyOwnerId?: string
  ) {
    return this.projectsService.findAll(status, propertyOwnerId);
  }

  @Get('by-owner/:propertyOwnerId')
  findByPropertyOwner(@Param('propertyOwnerId') propertyOwnerId: string) {
    return this.projectsService.findByPropertyOwner(propertyOwnerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.projectsService.getStatistics(id);
  }
}
