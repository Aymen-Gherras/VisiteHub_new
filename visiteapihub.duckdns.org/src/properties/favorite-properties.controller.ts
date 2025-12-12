import { Controller, Get, Post, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritePropertiesService } from './favorite-properties.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favorite-properties')
@Controller('favorite-properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritePropertiesController {
  constructor(private readonly favoritePropertiesService: FavoritePropertiesService) {}

  @Post(':propertyId')
  @ApiOperation({ summary: 'Add a property to favorites' })
  @ApiResponse({ status: 201, description: 'Property successfully added to favorites' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Property already in favorites' })
  addToFavorites(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favoritePropertiesService.addToFavorites(req.user.id, propertyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorite properties for the current user' })
  @ApiResponse({ status: 200, description: 'Return all favorite properties' })
  findAllByUser(@Request() req) {
    return this.favoritePropertiesService.findAllByUserId(req.user.id);
  }

  @Delete(':propertyId')
  @ApiOperation({ summary: 'Remove a property from favorites' })
  @ApiResponse({ status: 200, description: 'Property successfully removed from favorites' })
  @ApiResponse({ status: 404, description: 'Favorite property not found' })
  removeFromFavorites(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favoritePropertiesService.removeByUserAndProperty(req.user.id, propertyId);
  }
}