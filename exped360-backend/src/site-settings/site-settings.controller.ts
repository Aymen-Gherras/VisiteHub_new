import { Controller, Get, Patch, Body, Query, Post, UseGuards, UploadedFile, UseInterceptors, Param, Delete } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('site-settings')
@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  // Admin settings
  @Get('homepage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get homepage settings' })
  getSettings() {
    return this.service.getSettings();
  }

  @Patch('homepage')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update homepage settings (maxSlides 1-6, maxFeatured default 6)' })
  updateSettings(@Body('maxSlides') maxSlides?: number, @Body('maxFeatured') maxFeatured?: number) {
    return this.service.updateSettings(maxSlides !== undefined ? Number(maxSlides) : undefined, maxFeatured !== undefined ? Number(maxFeatured) : undefined);
  }

  // Admin carousel
  @Get('homepage-carousel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List carousel images (admin)' })
  list(@Query('includeInactive') includeInactive = 'true') {
    return this.service.listImages(includeInactive === 'true');
  }

  @Post('homepage-carousel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create carousel image (admin)' })
  create(@Body() body: { imageUrl: string; altText?: string; linkUrl?: string; isActive?: boolean }) {
    return this.service.createImage(body);
  }

  @Patch('homepage-carousel/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update carousel image (admin)' })
  update(@Param('id') id: string, @Body() patch: any) {
    return this.service.updateImage(id, patch);
  }

  @Delete('homepage-carousel/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete carousel image (admin)' })
  remove(@Param('id') id: string) {
    return this.service.deleteImage(id);
  }

  @Patch('homepage-carousel/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder carousel images (admin)' })
  reorder(@Body() items: Array<{ id: string; order: number }>) {
    return this.service.reorder(items);
  }

  @Post('homepage-carousel/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload image to Cloudinary and return URL (admin)' })
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.service.upload(file);
  }

  // Public
  @Get('homepage-carousel/public')
  @ApiOperation({ summary: 'Public: list active carousel images ordered by order and capped by maxSlides' })
  listPublic() {
    return this.service.listPublic();
  }
}


