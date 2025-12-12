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
import { AgencesService } from '../services/agences.service';
import { CreateAgenceDto } from '../dto/create-agence.dto';
import { UpdateAgenceDto } from '../dto/update-agence.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('admin/agences')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAgencesController {
  constructor(private readonly agencesService: AgencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAgenceDto: CreateAgenceDto) {
    return {
      success: true,
      data: await this.agencesService.create(createAgenceDto),
      message: 'Agence created successfully',
    };
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('wilaya') wilaya?: string,
    @Query('featured') featured?: string,
    @Query('active') active?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const options = {
      search,
      wilaya,
      featured: featured ? featured === 'true' : undefined,
      active: active ? active === 'true' : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    };

    const result = await this.agencesService.findAll(options);
    
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
      data: await this.agencesService.getStatistics(),
    };
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit?: string) {
    return {
      success: true,
      data: await this.agencesService.getFeatured(limit ? parseInt(limit) : 6),
    };
  }

  @Get('top-rated')
  async getTopRated(@Query('limit') limit?: string) {
    return {
      success: true,
      data: await this.agencesService.getTopRated(limit ? parseInt(limit) : 6),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.agencesService.findOne(id),
    };
  }

  @Get(':id/stats')
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.agencesService.getAgenceStats(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAgenceDto: UpdateAgenceDto,
  ) {
    return {
      success: true,
      data: await this.agencesService.update(id, updateAgenceDto),
      message: 'Agence updated successfully',
    };
  }

  @Patch(':id/rating')
  async updateRating(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('rating') rating: number,
  ) {
    return {
      success: true,
      data: await this.agencesService.updateRating(id, rating),
      message: 'Rating updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.agencesService.remove(id);
    return {
      success: true,
      message: 'Agence deleted successfully',
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
      data: await this.agencesService.searchByLocation(wilaya, daira),
    };
  }
}
