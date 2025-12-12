import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropertyAmenitiesService } from './property-amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('property-amenities')
@Controller('property-amenities')
export class PropertyAmenitiesController {
  constructor(private readonly propertyAmenitiesService: PropertyAmenitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property amenity' })
  @ApiResponse({ status: 201, description: 'Property amenity successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.propertyAmenitiesService.create(createAmenityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all property amenities' })
  @ApiResponse({ status: 200, description: 'Return all property amenities' })
  findAll() {
    return this.propertyAmenitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property amenity by id' })
  @ApiResponse({ status: 200, description: 'Return the property amenity' })
  @ApiResponse({ status: 404, description: 'Property amenity not found' })
  findOne(@Param('id') id: string) {
    return this.propertyAmenitiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a property amenity' })
  @ApiResponse({ status: 200, description: 'Property amenity successfully updated' })
  @ApiResponse({ status: 404, description: 'Property amenity not found' })
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.propertyAmenitiesService.update(id, updateAmenityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property amenity' })
  @ApiResponse({ status: 200, description: 'Property amenity successfully deleted' })
  @ApiResponse({ status: 404, description: 'Property amenity not found' })
  remove(@Param('id') id: string) {
    return this.propertyAmenitiesService.remove(id);
  }
}