import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { PropertyAmenity } from './entities/property-amenity.entity';
import { FavoriteProperty } from './entities/favorite-property.entity';
import { Paper } from './entities/paper.entity';
import { NearbyPlace } from './entities/nearby-place.entity';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { PropertyImagesController } from './property-images.controller';
import { PropertyImagesService } from './property-images.service';
import { PropertyAmenitiesController } from './property-amenities.controller';
import { PropertyAmenitiesService } from './property-amenities.service';
import { FavoritePropertiesController } from './favorite-properties.controller';
import { FavoritePropertiesService } from './favorite-properties.service';
import { PaperService } from './paper.service';
import { PaperController } from './paper.controller';
import { NearbyPlacesController } from './nearby-places.controller';
import { NearbyPlacesService } from './nearby-places.service';
import { FeaturedProperty } from './entities/featured-property.entity';
import { HomepageSettings } from '../site-settings/entities/homepage-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyImage, PropertyAmenity, FavoriteProperty, Paper, FeaturedProperty, HomepageSettings, NearbyPlace])],
  controllers: [
    PropertiesController,
    PropertyImagesController,
    PropertyAmenitiesController,
    FavoritePropertiesController,
    PaperController,
    NearbyPlacesController,
  ],
  providers: [
    PropertiesService,
    PropertyImagesService,
    PropertyAmenitiesService,
    FavoritePropertiesService,
    PaperService,
    NearbyPlacesService,
  ],
  exports: [
    PropertiesService,
    PropertyImagesService,
    PropertyAmenitiesService,
    FavoritePropertiesService,
    PaperService,
    NearbyPlacesService,
  ],
})
export class PropertiesModule {}