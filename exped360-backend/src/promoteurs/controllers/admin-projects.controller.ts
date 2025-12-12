import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectStatus } from '../entities/project.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('admin/projects')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProjectDto: CreateProjectDto) {
    return {
      success: true,
      data: await this.projectsService.create(createProjectDto),
      message: 'Project created successfully',
    };
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('wilaya') wilaya?: string,
    @Query('status') status?: ProjectStatus,
    @Query('promoteurId') promoteurId?: string,
    @Query('featured') featured?: string,
    @Query('active') active?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      search,
      wilaya,
      status,
      promoteurId,
      featured: featured ? featured === 'true' : undefined,
      active: active ? active === 'true' : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };

    const result = await this.projectsService.findAll(options);
    
    return {
      success: true,
      data: result.data,
      total: result.total,
      pagination: {
        limit: options.limit || result.total,
        offset: options.offset || 0,
        hasMore: (options.offset || 0) + (options.limit || result.total) < result.total,
      },
    };
  }

  @Get('statistics')
  async getStatistics() {
    return {
      success: true,
      data: await this.projectsService.getStatistics(),
    };
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit?: string) {
    return {
      success: true,
      data: await this.projectsService.getFeatured(limit ? parseInt(limit) : 6),
    };
  }

  @Get('by-status/:status')
  async getByStatus(
    @Param('status') status: ProjectStatus,
    @Query('limit') limit?: string,
  ) {
    return {
      success: true,
      data: await this.projectsService.getByStatus(status, limit ? parseInt(limit) : undefined),
    };
  }

  @Get('by-promoteur/:promoteurId')
  async findByPromoteur(@Param('promoteurId', ParseUUIDPipe) promoteurId: string) {
    return {
      success: true,
      data: await this.projectsService.findByPromoteur(promoteurId),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.projectsService.findOne(id),
    };
  }

  @Get(':id/stats')
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.projectsService.getProjectStats(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return {
      success: true,
      data: await this.projectsService.update(id, updateProjectDto),
      message: 'Project updated successfully',
    };
  }

  @Patch(':id/progress')
  async updateProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('completionPercentage') completionPercentage: number,
  ) {
    return {
      success: true,
      data: await this.projectsService.updateProgress(id, completionPercentage),
      message: 'Project progress updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.projectsService.remove(id);
    return {
      success: true,
      message: 'Project deleted successfully',
    };
  }

  @Get('search/location')
  async searchByLocation(
    @Query('wilaya') wilaya: string,
    @Query('daira') daira?: string,
  ) {
    if (!wilaya) {
      return {
        success: false,
        message: 'Wilaya parameter is required',
      };
    }

    return {
      success: true,
      data: await this.projectsService.searchByLocation(wilaya, daira),
    };
  }
}
