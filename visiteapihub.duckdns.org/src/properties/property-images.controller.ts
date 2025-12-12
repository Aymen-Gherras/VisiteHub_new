import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PropertyImagesService } from './property-images.service';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('property-images')
@Controller('property-images')
export class PropertyImagesController {
  constructor(private readonly propertyImagesService: PropertyImagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property image' })
  @ApiResponse({ status: 201, description: 'Property image successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPropertyImageDto: CreatePropertyImageDto) {
    return this.propertyImagesService.create(createPropertyImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all property images' })
  @ApiResponse({ status: 200, description: 'Return all property images' })
  findAll() {
    return this.propertyImagesService.findAll();
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get all images for a property' })
  @ApiResponse({ status: 200, description: 'Return all images for a property' })
  findByPropertyId(@Param('propertyId') propertyId: string) {
    return this.propertyImagesService.findByPropertyId(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property image by id' })
  @ApiResponse({ status: 200, description: 'Return the property image' })
  @ApiResponse({ status: 404, description: 'Property image not found' })
  findOne(@Param('id') id: string) {
    return this.propertyImagesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property image' })
  @ApiResponse({ status: 200, description: 'Property image successfully deleted' })
  @ApiResponse({ status: 404, description: 'Property image not found' })
  remove(@Param('id') id: string) {
    return this.propertyImagesService.remove(id);
  }
}