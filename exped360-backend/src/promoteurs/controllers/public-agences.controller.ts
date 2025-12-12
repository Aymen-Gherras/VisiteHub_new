import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AgencesService } from '../services/agences.service';

@Controller('api/agences')
export class PublicAgencesController {
  constructor(private readonly agencesService: AgencesService) {}

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
      active: true, // Only show active agences in public API
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    };

    const result = await this.agencesService.findAll(options);
    
    // Transform for public API - include basic stats
    const transformedData = await Promise.all(
      result.data.map(async (agence) => {
        const stats = await this.agencesService.getAgenceStats(agence.id);
        return {
          id: agence.id,
          name: agence.name,
          slug: agence.slug,
          description: agence.description,
          logo: agence.logo,
          website: agence.website,
          phone: agence.phone,
          email: agence.email,
          address: agence.address,
          wilaya: agence.wilaya,
          daira: agence.daira,
          foundedYear: agence.foundedYear,
          rating: agence.rating,
          reviewCount: agence.reviewCount,
          isFeatured: agence.isFeatured,
          stats,
          createdAt: agence.createdAt,
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
    const agences = await this.agencesService.getFeatured(limit ? parseInt(limit) : 6);
    
    const transformedData = await Promise.all(
      agences.map(async (agence) => {
        const stats = await this.agencesService.getAgenceStats(agence.id);
        return {
          id: agence.id,
          name: agence.name,
          slug: agence.slug,
          description: agence.description,
          logo: agence.logo,
          website: agence.website,
          wilaya: agence.wilaya,
          rating: agence.rating,
          reviewCount: agence.reviewCount,
          isFeatured: agence.isFeatured,
          stats,
        };
      })
    );

    return {
      success: true,
      data: transformedData,
    };
  }

  @Get('top-rated')
  async getTopRated(@Query('limit') limit?: string) {
    const agences = await this.agencesService.getTopRated(limit ? parseInt(limit) : 6);
    
    const transformedData = await Promise.all(
      agences.map(async (agence) => {
        const stats = await this.agencesService.getAgenceStats(agence.id);
        return {
          id: agence.id,
          name: agence.name,
          slug: agence.slug,
          description: agence.description,
          logo: agence.logo,
          rating: agence.rating,
          reviewCount: agence.reviewCount,
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
      const agence = await this.agencesService.findBySlug(slug);
      const stats = await this.agencesService.getAgenceStats(agence.id);
      
      return {
        success: true,
        data: {
          ...agence,
          stats,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Agence not found');
      }
      throw error;
    }
  }

  @Get(':slug/properties')
  async getProperties(@Param('slug') slug: string) {
    try {
      const agence = await this.agencesService.findBySlug(slug);
      
      // Return properties with basic transformations
      const transformedProperties = agence.properties?.map(property => ({
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
        throw new NotFoundException('Agence not found');
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

    const agences = await this.agencesService.searchByLocation(wilaya, daira);
    
    const transformedData = await Promise.all(
      agences.map(async (agence) => {
        const stats = await this.agencesService.getAgenceStats(agence.id);
        return {
          id: agence.id,
          name: agence.name,
          slug: agence.slug,
          description: agence.description,
          logo: agence.logo,
          wilaya: agence.wilaya,
          daira: agence.daira,
          rating: agence.rating,
          reviewCount: agence.reviewCount,
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
