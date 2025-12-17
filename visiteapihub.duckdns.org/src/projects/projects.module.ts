import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { Promoteur } from '../promoteurs/entities/promoteur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Promoteur])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
