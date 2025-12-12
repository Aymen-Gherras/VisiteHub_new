import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { PromoteursService } from '../services/promoteurs.service';
import { ProjectsService } from '../services/projects.service';

@Controller('api/promoteurs')
export class PublicPromoteursController {
  constructor(
    private readonly promoteursService: PromoteursService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('wilaya') wilaya?: string,
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      search,
      wilaya,
      featured: featured ? featured === 'true' : undefined,
      active: true, // Only show active promoteurs in public API
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    };

    const result = await this.promoteursService.findAll(options);
    
    // Transform for public API - include basic stats
    const transformedData = await Promise.all(
      result.data.map(async (promoteur) => {
        const stats = await this.promoteursService.getPromoteurStats(promoteur.id);
        return {
          id: promoteur.id,
          name: promoteur.name,
          slug: promoteur.slug,
          description: promoteur.description,
          logo: promoteur.logo,
          website: promoteur.website,
          phone: promoteur.phone,
          email: promoteur.email,
          address: promoteur.address,
          wilaya: promoteur.wilaya,
          daira: promoteur.daira,
          foundedYear: promoteur.foundedYear,
          isFeatured: promoteur.isFeatured,
          stats,
          createdAt: promoteur.createdAt,
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
    const promoteurs = await this.promoteursService.getFeatured(limit ? parseInt(limit) : 6);
    
    const transformedData = await Promise.all(
      promoteurs.map(async (promoteur) => {
        const stats = await this.promoteursService.getPromoteurStats(promoteur.id);
        return {
          id: promoteur.id,
          name: promoteur.name,
          slug: promoteur.slug,
          description: promoteur.description,
          logo: promoteur.logo,
          website: promoteur.website,
          wilaya: promoteur.wilaya,
          isFeatured: promoteur.isFeatured,
          stats,
        };
      })
    );

    return {
      success: true,
      data: transformedData,
    };
  }

  @Get('popular')
  async getPopular(@Query('limit') limit?: string) {
    const promoteurs = await this.promoteursService.getPopular(limit ? parseInt(limit) : 6);
    
    const transformedData = await Promise.all(
      promoteurs.map(async (promoteur) => {
        const stats = await this.promoteursService.getPromoteurStats(promoteur.id);
        return {
          id: promoteur.id,
          name: promoteur.name,
          slug: promoteur.slug,
          description: promoteur.description,
          logo: promoteur.logo,
          viewCount: promoteur.viewCount,
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
      const promoteur = await this.promoteursService.findBySlug(slug);
      const stats = await this.promoteursService.getPromoteurStats(promoteur.id);
      
      return {
        success: true,
        data: {
          ...promoteur,
          stats,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Promoteur not found');
      }
      throw error;
    }
  }

  @Get(':slug/projects')
  async getProjects(@Param('slug') slug: string) {
    try {
      const promoteur = await this.promoteursService.findBySlug(slug);
      const projects = await this.projectsService.findByPromoteur(promoteur.id);
      
      // Transform projects for public API
      const transformedProjects = await Promise.all(
        projects.map(async (project) => {
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
            isFeatured: project.isFeatured,
            stats,
            createdAt: project.createdAt,
          };
        })
      );

      return {
        success: true,
        data: transformedProjects,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Promoteur not found');
      }
      throw error;
    }
  }

  @Get(':slug/properties')
  async getProperties(@Param('slug') slug: string) {
    try {
      const promoteur = await this.promoteursService.findBySlug(slug);
      
      // Return properties with basic transformations
      const transformedProperties = promoteur.properties?.map(property => ({
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
        throw new NotFoundException('Promoteur not found');
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

    const promoteurs = await this.promoteursService.searchByLocation(wilaya, daira);
    
    const transformedData = await Promise.all(
      promoteurs.map(async (promoteur) => {
        const stats = await this.promoteursService.getPromoteurStats(promoteur.id);
        return {
          id: promoteur.id,
          name: promoteur.name,
          slug: promoteur.slug,
          description: promoteur.description,
          logo: promoteur.logo,
          wilaya: promoteur.wilaya,
          daira: promoteur.daira,
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
