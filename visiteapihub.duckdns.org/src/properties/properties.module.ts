import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Paper } from './entities/paper.entity';
import { NearbyPlace } from './entities/nearby-place.entity';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PaperService } from './paper.service';
import { PaperController } from './paper.controller';
import { NearbyPlacesController } from './nearby-places.controller';
import { NearbyPlacesService } from './nearby-places.service';
import { FeaturedProperty } from './entities/featured-property.entity';
import { HomepageSettings } from '../site-settings/entities/homepage-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Paper, FeaturedProperty, HomepageSettings, NearbyPlace])],
  controllers: [
    PropertiesController,
    PaperController,
    NearbyPlacesController,
  ],
  providers: [
    PropertiesService,
    PaperService,
    NearbyPlacesService,
  ],
  exports: [
    PropertiesService,
    PaperService,
    NearbyPlacesService,
  ],
})
export class PropertiesModule {}