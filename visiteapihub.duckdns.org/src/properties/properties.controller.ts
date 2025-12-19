import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UseFilters, Header, Req } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';
import { Throttle } from '@nestjs/throttler';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PropertyType, TransactionType } from './entities/property.entity';
import { DisableCache } from '../common/decorators/disable-cache.decorator';

@ApiTags('properties')
@Controller('properties')
@UseFilters(HttpExceptionFilter)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, description: 'Property successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPropertyDto: CreatePropertyDto) {
    console.log('🔍 PropertiesController.create - Received price:', createPropertyDto.price, 'Type:', typeof createPropertyDto.price);
    // If imageUrls are provided, use createWithImages method
    if (createPropertyDto.imageUrls && createPropertyDto.imageUrls.length > 0) {
      const { imageUrls, ...propertyData } = createPropertyDto;
      return this.propertiesService.createWithImages(propertyData, imageUrls);
    }
    return this.propertiesService.create(createPropertyDto);
  }

  @Post('with-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property with images' })
  @ApiResponse({ status: 201, description: 'Property with images successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createWithImages(@Body() createPropertyWithImagesDto: CreatePropertyDto & { imageUrls: string[] }) {
    const { imageUrls, ...createPropertyDto } = createPropertyWithImagesDto;
    return this.propertiesService.createWithImages(createPropertyDto, imageUrls);
  }

  @Get()
  // Note: Caching is enabled with 30-second TTL via SmartCacheInterceptor
  // This provides fresh data while still benefiting from cache performance
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute for properties endpoint
  @ApiOperation({ summary: 'Get all properties or filter them' })
  @ApiResponse({ status: 200, description: 'Return all properties with pagination' })
  @ApiQuery({ name: 'type', enum: PropertyType, required: false })
  @ApiQuery({ name: 'transactionType', enum: TransactionType, required: false })
  @ApiQuery({ name: 'minPrice', type: Number, required: false })
  @ApiQuery({ name: 'maxPrice', type: Number, required: false })
  @ApiQuery({ name: 'minBedrooms', type: Number, required: false })
  @ApiQuery({ name: 'maxBedrooms', type: Number, required: false })
  @ApiQuery({ name: 'minBathrooms', type: Number, required: false })
  @ApiQuery({ name: 'maxBathrooms', type: Number, required: false })
  @ApiQuery({ name: 'minSurface', type: Number, required: false })
  @ApiQuery({ name: 'maxSurface', type: Number, required: false })
  @ApiQuery({ name: 'wilaya', type: String, required: false })
  @ApiQuery({ name: 'daira', type: String, required: false })
  @ApiQuery({ name: 'propertyOwnerType', type: String, required: false, description: 'Filter by owner type: Particulier, Agence immobilière, Promotion immobilière' })
  @ApiQuery({ name: 'has360Tour', type: Boolean, required: false })
  @ApiQuery({ name: 'sortBy', type: String, required: false, description: 'Sort by: price_asc, price_desc, surface_asc, surface_desc, newest, oldest' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of properties per page (default: 20)' })
  @ApiQuery({ name: 'offset', type: Number, required: false, description: 'Number of properties to skip (default: 0)' })
  findAll(@Query() filters: PropertyFiltersDto) {
    // Check if any filters are provided
    const hasFilters = Object.values(filters).some(value => value !== undefined);
    
    if (hasFilters) {
      return this.propertiesService.findByFilters(filters);
    }
    return this.propertiesService.findAll(filters.limit || 20, filters.offset || 0);
  }

  @Get('stats')
  @Header('Cache-Control', 'no-store')
  @DisableCache()
  @ApiOperation({ summary: 'Get properties stats (count + total value)' })
  stats() {
    return this.propertiesService.getStats();
  }

  @Get('featured')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get featured properties' })
  @ApiResponse({ status: 200, description: 'Return featured properties (max 6)' })
  findFeatured() {
    return this.propertiesService.findFeatured();
  }

  // Admin: list featured ordered
  @Get('featured/admin')
  @Header('Cache-Control', 'no-store')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list featured properties with positions' })
  listFeaturedAdmin() {
    return this.propertiesService.listFeaturedAdmin();
  }

  // Admin: add property to featured set
  @Post('featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: add property to featured set' })
  addFeatured(@Body('propertyId') propertyId: string, @Body('slug') slug?: string) {
    const ref = propertyId || slug || '';
    return this.propertiesService.addFeatured(ref);
  }

  // Admin: remove from featured set
  @Delete('featured/:propertyId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: remove property from featured set' })
  removeFeatured(@Param('propertyId') propertyId: string) {
    return this.propertiesService.removeFeatured(propertyId);
  }

  // Admin: reorder featured
  @Patch('featured/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: reorder featured properties by positions' })
  reorderFeatured(@Body() payload: Array<{ propertyId: string; position: number }>) {
    return this.propertiesService.reorderFeatured(payload);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a property by slug' })
  @ApiResponse({ status: 200, description: 'Return the property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.propertiesService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property by id' })
  @ApiResponse({ status: 200, description: 'Return the property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id/view')
  @ApiOperation({ summary: 'Increment property view count' })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  incrementView(@Param('id') id: string) {
    return this.propertiesService.incrementView(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a property' })
  @ApiResponse({ status: 200, description: 'Property successfully updated' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto, @Req() req: any) {
    // Log raw body before any transformation
    const rawBody = req.body;
    console.log('🔍 PropertiesController.update - Raw request body:', JSON.stringify(rawBody));
    console.log('🔍 PropertiesController.update - Raw price:', rawBody?.price, 'Type:', typeof rawBody?.price);
    
    // Log DTO after transformation
    console.log('🔍 PropertiesController.update - DTO price:', updatePropertyDto.price, 'Type:', typeof updatePropertyDto.price);
    
    // If price is a number in raw body but string in DTO, something converted it
    if (typeof rawBody?.price === 'number' && typeof updatePropertyDto.price === 'string') {
      console.log('✅ Price was converted from number to string by Transform');
    } else if (typeof rawBody?.price === 'string' && typeof updatePropertyDto.price === 'string') {
      console.log('✅ Price stayed as string through transformation');
    } else {
      console.log('⚠️ Price type mismatch - Raw:', typeof rawBody?.price, 'DTO:', typeof updatePropertyDto.price);
    }
    
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property' })
  @ApiResponse({ status: 200, description: 'Property successfully deleted' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

  @Patch(':id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle featured status of a property' })
  @ApiResponse({ status: 200, description: 'Featured status toggled' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 400, description: 'Maximum featured properties limit reached' })
  toggleFeatured(@Param('id') id: string) {
    return this.propertiesService.toggleFeatured(id);
  }
}