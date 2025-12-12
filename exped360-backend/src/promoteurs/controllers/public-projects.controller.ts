import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectStatus } from '../entities/project.entity';

@Controller('api/projects')
export class PublicProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('wilaya') wilaya?: string,
    @Query('status') status?: ProjectStatus,
    @Query('promoteurId') promoteurId?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      search,
      wilaya,
      status,
      promoteurId,
      featured: featured ? featured === 'true' : undefined,
      active: true, // Only show active projects in public API
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    };

    const result = await this.projectsService.findAll(options);
    
    // Transform for public API - include basic stats
    const transformedData = await Promise.all(
      result.data.map(async (project) => {
        const stats = await this.projectsService.getProjectStats(project.id);
        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          coverImage: project.coverImage,
          images: project.images,
          location: project.location,
          wilaya: project.wilaya,
          daira: project.daira,
          status: project.status,
          projectType: project.projectType,
          startDate: project.startDate,
          expectedCompletionDate: project.expectedCompletionDate,
          minPrice: project.minPrice,
          maxPrice: project.maxPrice,
          completionPercentage: project.completionPercentage,
          isFeatured: project.isFeatured,
          promoteur: {
            id: project.promoteur.id,
            name: project.promoteur.name,
            slug: project.promoteur.slug,
            logo: project.promoteur.logo,
          },
          stats,
          createdAt: project.createdAt,
        };
      })
    );

    return {
      success: true,
      data: transformedData,
      total: result.total,
      pagination: {
        limit: options.limit,
        offset: options.offset,
        hasMore: options.offset + options.limit < result.total,
      },
    };
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit?: string) {
    const projects = await this.projectsService.getFeatured(limit ? parseInt(limit) : 6);
    
    const transformedData = await Promise.all(
      projects.map(async (project) => {
        const stats = await this.projectsService.getProjectStats(project.id);
        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          coverImage: project.coverImage,
          location: project.location,
          wilaya: project.wilaya,
          status: project.status,
          projectType: project.projectType,
          minPrice: project.minPrice,
          maxPrice: project.maxPrice,
          completionPercentage: project.completionPercentage,
          isFeatured: project.isFeatured,
          promoteur: {
            id: project.promoteur.id,
            name: project.promoteur.name,
            slug: project.promoteur.slug,
            logo: project.promoteur.logo,
          },
          stats,
        };
      })
    );

    return {
      success: true,
      data: transformedData,
    };
  }

  @Get('by-status/:status')
  async getByStatus(
    @Param('status') status: ProjectStatus,
    @Query('limit') limit?: string,
  ) {
    const projects = await this.projectsService.getByStatus(status, limit ? parseInt(limit) : undefined);
    
    const transformedData = await Promise.all(
      projects.map(async (project) => {
        const stats = await this.projectsService.getProjectStats(project.id);
        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          coverImage: project.coverImage,
          location: project.location,
          wilaya: project.wilaya,
          status: project.status,
          completionPercentage: project.completionPercentage,
          promoteur: {
            id: project.promoteur.id,
            name: project.promoteur.name,
            slug: project.promoteur.slug,
          },
          stats,
        };
      })
    );

    return {
      success: true,
      data: transformedData,
    };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    try {
      const project = await this.projectsService.findBySlug(slug);
      const stats = await this.projectsService.getProjectStats(project.id);
      
      return {
        success: true,
        data: {
          ...project,
          stats,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
  }

  @Get(':slug/properties')
  async getProperties(@Param('slug') slug: string) {
    try {
      const project = await this.projectsService.findBySlug(slug);
      
      // Return properties with basic transformations
      const transformedProperties = project.properties?.map(property => ({
        id: property.id,
        title: property.title,
        slug: property.slug,
        type: property.type,
        transactionType: property.transactionType,
        price: property.price,
        surface: property.surface,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        wilaya: property.wilaya,
        daira: property.daira,
        address: property.address,
        isFeatured: property.isFeatured,
        createdAt: property.createdAt,
        // Add first image if available
        image: property.images?.[0]?.imageUrl || null,
      })) || [];

      return {
        success: true,
        data: transformedProperties,
        total: transformedProperties.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Project not found');
      }
      throw error;
    }
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

    const projects = await this.projectsService.searchByLocation(wilaya, daira);
    
    const transformedData = await Promise.all(
      projects.map(async (project) => {
        const stats = await this.projectsService.getProjectStats(project.id);
        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          coverImage: project.coverImage,
          location: project.location,
          wilaya: project.wilaya,
          daira: project.daira,
          status: project.status,
          promoteur: {
            id: project.promoteur.id,
            name: project.promoteur.name,
            slug: project.promoteur.slug,
          },
          stats,
        };
      })
    );

    return {
      success: true,
      data: transformedData,
    };
  }
}
