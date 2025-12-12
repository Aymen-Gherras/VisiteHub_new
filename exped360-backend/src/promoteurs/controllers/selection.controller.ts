import { Controller, Get, Query } from '@nestjs/common';
import { PromoteursService } from '../services/promoteurs.service';
import { AgencesService } from '../services/agences.service';
import { ProjectsService } from '../services/projects.service';

@Controller('api/selection')
export class SelectionController {
  constructor(
    private readonly promoteursService: PromoteursService,
    private readonly agencesService: AgencesService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('promoteurs')
  async getPromoteursForSelection(@Query('search') search?: string) {
    const result = await this.promoteursService.findAll({
      search,
      active: true,
      limit: 100, // Reasonable limit for dropdown
    });

    // Return simplified data for selection
    return {
      success: true,
      data: result.data.map(promoteur => ({
        id: promoteur.id,
        name: promoteur.name,
        slug: promoteur.slug,
        logo: promoteur.logo,
        wilaya: promoteur.wilaya,
      })),
    };
  }

  @Get('agences')
  async getAgencesForSelection(@Query('search') search?: string) {
    const result = await this.agencesService.findAll({
      search,
      active: true,
      limit: 100, // Reasonable limit for dropdown
    });

    // Return simplified data for selection
    return {
      success: true,
      data: result.data.map(agence => ({
        id: agence.id,
        name: agence.name,
        slug: agence.slug,
        logo: agence.logo,
        wilaya: agence.wilaya,
        rating: agence.rating,
      })),
    };
  }

  @Get('projects')
  async getProjectsForSelection(
    @Query('promoteurId') promoteurId?: string,
    @Query('search') search?: string,
  ) {
    const options: any = {
      search,
      active: true,
      limit: 100,
    };

    if (promoteurId) {
      options.promoteurId = promoteurId;
    }

    const result = await this.projectsService.findAll(options);

    // Return simplified data for selection
    return {
      success: true,
      data: result.data.map(project => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        location: project.location,
        status: project.status,
        promoteur: {
          id: project.promoteur.id,
          name: project.promoteur.name,
        },
      })),
    };
  }
}
