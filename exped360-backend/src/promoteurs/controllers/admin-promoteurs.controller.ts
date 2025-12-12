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
import { PromoteursService } from '../services/promoteurs.service';
import { CreatePromoteurDto } from '../dto/create-promoteur.dto';
import { UpdatePromoteurDto } from '../dto/update-promoteur.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('admin/promoteurs')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminPromoteursController {
  constructor(private readonly promoteursService: PromoteursService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPromoteurDto: CreatePromoteurDto) {
    return {
      success: true,
      data: await this.promoteursService.create(createPromoteurDto),
      message: 'Promoteur created successfully',
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

    const result = await this.promoteursService.findAll(options);
    
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
      data: await this.promoteursService.getStatistics(),
    };
  }

  @Get('featured')
  async getFeatured(@Query('limit') limit?: string) {
    return {
      success: true,
      data: await this.promoteursService.getFeatured(limit ? parseInt(limit) : 6),
    };
  }

  @Get('popular')
  async getPopular(@Query('limit') limit?: string) {
    return {
      success: true,
      data: await this.promoteursService.getPopular(limit ? parseInt(limit) : 6),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.promoteursService.findOne(id),
    };
  }

  @Get(':id/stats')
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return {
      success: true,
      data: await this.promoteursService.getPromoteurStats(id),
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePromoteurDto: UpdatePromoteurDto,
  ) {
    return {
      success: true,
      data: await this.promoteursService.update(id, updatePromoteurDto),
      message: 'Promoteur updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.promoteursService.remove(id);
    return {
      success: true,
      message: 'Promoteur deleted successfully',
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
      data: await this.promoteursService.searchByLocation(wilaya, daira),
    };
  }
}
