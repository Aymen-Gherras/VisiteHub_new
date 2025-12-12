import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NearbyPlacesService } from './nearby-places.service';
import { CreateNearbyPlaceDto } from './dto/create-nearby-place.dto';
import { UpdateNearbyPlaceDto } from './dto/update-nearby-place.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('nearby-places')
@Controller('nearby-places')
export class NearbyPlacesController {
  constructor(private readonly nearbyPlacesService: NearbyPlacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new nearby place for a property' })
  @ApiResponse({ status: 201, description: 'Nearby place successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request (max 10 places per property)' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  create(@Body() createNearbyPlaceDto: CreateNearbyPlaceDto) {
    return this.nearbyPlacesService.create(createNearbyPlaceDto);
  }

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get all nearby places for a property' })
  @ApiResponse({ status: 200, description: 'Return all nearby places for the property' })
  findAllByProperty(@Param('propertyId') propertyId: string) {
    return this.nearbyPlacesService.findAllByProperty(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a nearby place by id' })
  @ApiResponse({ status: 200, description: 'Return the nearby place' })
  @ApiResponse({ status: 404, description: 'Nearby place not found' })
  findOne(@Param('id') id: string) {
    return this.nearbyPlacesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a nearby place' })
  @ApiResponse({ status: 200, description: 'Nearby place successfully updated' })
  @ApiResponse({ status: 404, description: 'Nearby place not found' })
  update(@Param('id') id: string, @Body() updateNearbyPlaceDto: UpdateNearbyPlaceDto) {
    return this.nearbyPlacesService.update(id, updateNearbyPlaceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a nearby place' })
  @ApiResponse({ status: 204, description: 'Nearby place successfully deleted' })
  @ApiResponse({ status: 404, description: 'Nearby place not found' })
  remove(@Param('id') id: string) {
    return this.nearbyPlacesService.remove(id);
  }

  @Delete('property/:propertyId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN, UserType.AGENT)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all nearby places for a property' })
  @ApiResponse({ status: 204, description: 'All nearby places successfully deleted' })
  removeAllByProperty(@Param('propertyId') propertyId: string) {
    return this.nearbyPlacesService.removeAllByProperty(propertyId);
  }
}

