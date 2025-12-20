import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { VisitEvent } from './entities/visit-event.entity';
import { ContactClickEvent } from './entities/contact-click-event.entity';
import { Property } from '../properties/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VisitEvent, ContactClickEvent, Property])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}


