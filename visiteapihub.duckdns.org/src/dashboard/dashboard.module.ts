import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Property } from '../properties/entities/property.entity';
import { Agence } from '../agences/entities/agence.entity';
import { Promoteur } from '../promoteurs/entities/promoteur.entity';
import { Project } from '../projects/entities/project.entity';
import { VisitEvent } from '../analytics/entities/visit-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Agence, Promoteur, Project, VisitEvent])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
