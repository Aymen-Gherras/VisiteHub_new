import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';
import { PromoteursService } from './promoteurs.service';
import { CreatePromoteurDto } from './dto/create-promoteur.dto';
import { UpdatePromoteurDto } from './dto/update-promoteur.dto';

@ApiTags('promoteurs')
@Controller('promoteurs')
export class PromoteursController {
  constructor(private readonly promoteursService: PromoteursService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promoteur (Admin only)' })
  @ApiResponse({ status: 201, description: 'Promoteur successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Promoteur with this name already exists' })
  create(@Body() createPromoteurDto: CreatePromoteurDto) {
    return this.promoteursService.create(createPromoteurDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promoteurs' })
  @ApiResponse({ status: 200, description: 'Return all promoteurs' })
  findAll() {
    return this.promoteursService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a promoteur by ID' })
  @ApiResponse({ status: 200, description: 'Return the promoteur' })
  @ApiResponse({ status: 404, description: 'Promoteur not found' })
  findOne(@Param('id') id: string) {
    return this.promoteursService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a promoteur by slug' })
  @ApiResponse({ status: 200, description: 'Return the promoteur' })
  @ApiResponse({ status: 404, description: 'Promoteur not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.promoteursService.findBySlug(slug);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get promoteur statistics' })
  @ApiResponse({ status: 200, description: 'Return promoteur statistics' })
  @ApiResponse({ status: 404, description: 'Promoteur not found' })
  getStats(@Param('id') id: string) {
    return this.promoteursService.getPromoteurStats(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a promoteur (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promoteur successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Promoteur not found' })
  @ApiResponse({ status: 409, description: 'Promoteur with this name already exists' })
  update(@Param('id') id: string, @Body() updatePromoteurDto: UpdatePromoteurDto) {
    return this.promoteursService.update(id, updatePromoteurDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a promoteur (Admin only)' })
  @ApiResponse({ status: 200, description: 'Promoteur successfully deleted' })
  @ApiResponse({ status: 404, description: 'Promoteur not found' })
  remove(@Param('id') id: string) {
    return this.promoteursService.remove(id);
  }
}
