import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Agence } from '../agences/entities/agence.entity';
import { Promoteur } from '../promoteurs/entities/promoteur.entity';
import { Project } from '../projects/entities/project.entity';
import { VisitEvent } from '../analytics/entities/visit-event.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(Agence)
    private readonly agenceRepo: Repository<Agence>,
    @InjectRepository(Promoteur)
    private readonly promoteurRepo: Repository<Promoteur>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(VisitEvent)
    private readonly visitRepo: Repository<VisitEvent>,
  ) {}

  async summary(): Promise<{
    totalProperties: number;
    activeListings: number;
    totalAgences: number;
    totalPromoteurs: number;
    totalProjects: number;
    totalVisits: number;
    totalValueDzd: number;
  }> {
    const [totalProperties, totalAgences, totalPromoteurs, totalProjects, totalVisits] = await Promise.all([
      this.propertyRepo.count(),
      this.agenceRepo.count(),
      this.promoteurRepo.count(),
      this.projectRepo.count(),
      this.visitRepo.count(),
    ]);

    // prices are stored as strings; sanitize for SUM
    const row = await this.propertyRepo
      .createQueryBuilder('p')
      .select(
        "COALESCE(SUM(CAST(REPLACE(REPLACE(p.price, ',', ''), ' ', '') AS DECIMAL(18,2))), 0)",
        'totalValue',
      )
      .getRawOne<{ totalValue: string | number }>();

    const totalValueDzd = row?.totalValue ? Number(row.totalValue) : 0;
    const activeListings = totalProperties;

    return {
      totalProperties,
      activeListings,
      totalAgences,
      totalPromoteurs,
      totalProjects,
      totalVisits,
      totalValueDzd: Number.isFinite(totalValueDzd) ? Math.round(totalValueDzd) : 0,
    };
  }
}
