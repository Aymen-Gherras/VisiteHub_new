import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PropertyOwnersService } from './property-owners.service';
import { CreatePropertyOwnerDto } from './dto/create-property-owner.dto';
import { UpdatePropertyOwnerDto } from './dto/update-property-owner.dto';
import { PropertyOwnerType } from './entities/property-owner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('property-owners')
export class PropertyOwnersController {
  constructor(private readonly propertyOwnersService: PropertyOwnersService) {}

  // Admin endpoints (protected)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPropertyOwnerDto: CreatePropertyOwnerDto) {
    return this.propertyOwnersService.create(createPropertyOwnerDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePropertyOwnerDto: UpdatePropertyOwnerDto) {
    return this.propertyOwnersService.update(id, updatePropertyOwnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.propertyOwnersService.remove(id);
  }

  // Public endpoints (no auth required)
  @Get()
  findAll(@Query('ownerType') ownerType?: PropertyOwnerType) {
    return this.propertyOwnersService.findAll(ownerType);
  }

  @Get('agences')
  findAllAgences() {
    return this.propertyOwnersService.findAllAgences();
  }

  @Get('promoteurs')
  findAllPromoteurs() {
    return this.propertyOwnersService.findAllPromoteurs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyOwnersService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.propertyOwnersService.findBySlug(slug);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.propertyOwnersService.getStatistics(id);
  }
}
