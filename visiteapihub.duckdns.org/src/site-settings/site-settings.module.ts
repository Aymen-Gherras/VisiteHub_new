import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageSettings } from './entities/homepage-settings.entity';
import { HomepageCarouselImage } from './entities/homepage-carousel-image.entity';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingsController } from './site-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HomepageSettings, HomepageCarouselImage])],
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}


