import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Promoteur } from './entities/promoteur.entity';
import { Agence } from './entities/agence.entity';
import { Project } from './entities/project.entity';
import { Property } from '../properties/entities/property.entity';

// Services
import { PromoteursService } from './services/promoteurs.service';
import { AgencesService } from './services/agences.service';
import { ProjectsService } from './services/projects.service';
import { PropertyAssignmentService } from './services/property-assignment.service';

// Admin Controllers
import { AdminPromoteursController } from './controllers/admin-promoteurs.controller';
import { AdminAgencesController } from './controllers/admin-agences.controller';
import { AdminProjectsController } from './controllers/admin-projects.controller';
import { AdminPropertyAssignmentController } from './controllers/admin-property-assignment.controller';

// Public Controllers
import { PublicPromoteursController } from './controllers/public-promoteurs.controller';
import { PublicAgencesController } from './controllers/public-agences.controller';
import { PublicProjectsController } from './controllers/public-projects.controller';
import { SelectionController } from './controllers/selection.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promoteur,
      Agence,
      Project,
      Property,
    ]),
  ],
  controllers: [
    // Admin controllers (with proper auth guards)
    AdminPromoteursController,
    AdminAgencesController,
    AdminProjectsController,
    AdminPropertyAssignmentController,
    // Public controllers
    PublicPromoteursController,
    PublicAgencesController,
    PublicProjectsController,
    SelectionController,
  ],
  providers: [
    PromoteursService,
    AgencesService,
    ProjectsService,
    PropertyAssignmentService,
  ],
  exports: [
    PromoteursService,
    AgencesService,
    ProjectsService,
    PropertyAssignmentService,
  ],
})
export class PromoteursModule {}
