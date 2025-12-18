import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoteursService } from './promoteurs.service';
import { PromoteursController } from './promoteurs.controller';
import { Promoteur } from './entities/promoteur.entity';
import { Project } from '../projects/entities/project.entity';
import { Property } from '../properties/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promoteur, Project, Property])],
  controllers: [PromoteursController],
  providers: [PromoteursService],
  exports: [PromoteursService],
})
export class PromoteursModule {}
