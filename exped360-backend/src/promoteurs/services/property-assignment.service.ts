import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { Promoteur } from '../entities/promoteur.entity';
import { Agence } from '../entities/agence.entity';
import { Project, ProjectStatus } from '../entities/project.entity';

@Injectable()
export class PropertyAssignmentService {
  private readonly logger = new Logger(PropertyAssignmentService.name);

  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Promoteur)
    private promoteurRepository: Repository<Promoteur>,
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  /**
   * Automatically assign a property to the appropriate agence or promoteur
   * based on propertyOwnerName
   */
  async autoAssignProperty(property: Property): Promise<Property> {
    if (!property.propertyOwnerName || property.propertyOwnerType === 'Particulier') {
      return property;
    }

    try {
      if (property.propertyOwnerType === 'Agence immobilière') {
        await this.assignToAgence(property);
      } else if (property.propertyOwnerType === 'Promotion immobilière') {
        await this.assignToPromoteur(property);
      }
    } catch (error) {
      this.logger.error(`Failed to auto-assign property ${property.id}: ${error.message}`);
    }

    return property;
  }

  /**
   * Assign property to an agence based on propertyOwnerName
   */
  private async assignToAgence(property: Property): Promise<void> {
    const agence = await this.agenceRepository.findOne({
      where: { name: property.propertyOwnerName }
    });

    if (agence) {
      property.agence = agence;
      await this.propertyRepository.save(property);
      this.logger.log(`Property ${property.id} assigned to agence ${agence.name}`);
    } else {
      this.logger.warn(`No agence found with name: ${property.propertyOwnerName}`);
    }
  }

  /**
   * Assign property to a promoteur based on propertyOwnerName
   * Optionally assign to an active project if available
   */
  private async assignToPromoteur(property: Property): Promise<void> {
    const promoteur = await this.promoteurRepository.findOne({
      where: { name: property.propertyOwnerName }
    });

    if (promoteur) {
      property.promoteur = promoteur;

      // Try to assign to an active project in the same wilaya/daira
      const activeProject = await this.projectRepository.findOne({
        where: {
          promoteur: { id: promoteur.id },
          isActive: true,
          status: ProjectStatus.CONSTRUCTION,
          wilaya: property.wilaya,
          daira: property.daira,
        },
        order: { createdAt: 'DESC' }
      });

      if (activeProject) {
        property.project = activeProject;
        this.logger.log(`Property ${property.id} assigned to project ${activeProject.name}`);
      }

      await this.propertyRepository.save(property);
      this.logger.log(`Property ${property.id} assigned to promoteur ${promoteur.name}`);
    } else {
      this.logger.warn(`No promoteur found with name: ${property.propertyOwnerName}`);
    }
  }

  /**
   * Manually assign a property to an agence
   */
  async assignPropertyToAgence(propertyId: string, agenceId: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId }
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const agence = await this.agenceRepository.findOne({
      where: { id: agenceId }
    });

    if (!agence) {
      throw new NotFoundException('Agence not found');
    }

    // Clear other assignments
    property.promoteur = undefined;
    property.project = undefined;
    property.agence = agence;

    // Update property owner fields for consistency
    property.propertyOwnerType = 'Agence immobilière';
    property.propertyOwnerName = agence.name;

    const savedProperty = await this.propertyRepository.save(property);
    this.logger.log(`Property ${propertyId} manually assigned to agence ${agence.name}`);
    
    return savedProperty;
  }

  /**
   * Manually assign a property to a promoteur and optionally a project
   */
  async assignPropertyToPromoteur(
    propertyId: string, 
    promoteurId: string, 
    projectId?: string
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId }
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const promoteur = await this.promoteurRepository.findOne({
      where: { id: promoteurId }
    });

    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }

    // Clear agence assignment
    property.agence = undefined;
    property.promoteur = promoteur;

    // Assign to project if provided
    if (projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: projectId, promoteur: { id: promoteurId } }
      });

      if (!project) {
        throw new NotFoundException('Project not found or does not belong to this promoteur');
      }

      property.project = project;
    } else {
      property.project = undefined;
    }

    // Update property owner fields for consistency
    property.propertyOwnerType = 'Promotion immobilière';
    property.propertyOwnerName = promoteur.name;

    const savedProperty = await this.propertyRepository.save(property);
    this.logger.log(`Property ${propertyId} manually assigned to promoteur ${promoteur.name}`);
    
    return savedProperty;
  }

  /**
   * Remove all assignments from a property (make it Particulier)
   */
  async removePropertyAssignments(propertyId: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId }
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    property.agence = undefined;
    property.promoteur = undefined;
    property.project = undefined;
    property.propertyOwnerType = 'Particulier';
    property.propertyOwnerName = undefined;

    const savedProperty = await this.propertyRepository.save(property);
    this.logger.log(`Removed all assignments from property ${propertyId}`);
    
    return savedProperty;
  }

  /**
   * Bulk assign properties to entities based on propertyOwnerName
   */
  async bulkAutoAssignProperties(): Promise<{ assigned: number; failed: number }> {
    const properties = await this.propertyRepository.find({
      where: [
        { propertyOwnerType: 'Agence immobilière', agence: IsNull() },
        { propertyOwnerType: 'Promotion immobilière', promoteur: IsNull() }
      ]
    });

    let assigned = 0;
    let failed = 0;

    for (const property of properties) {
      try {
        await this.autoAssignProperty(property);
        assigned++;
      } catch (error) {
        failed++;
        this.logger.error(`Failed to assign property ${property.id}: ${error.message}`);
      }
    }

    this.logger.log(`Bulk assignment completed: ${assigned} assigned, ${failed} failed`);
    return { assigned, failed };
  }

  /**
   * Get assignment statistics
   */
  async getAssignmentStats() {
    const [
      totalProperties,
      assignedToAgences,
      assignedToPromoteurs,
      assignedToProjects,
      unassignedAgenceProperties,
      unassignedPromoteurProperties
    ] = await Promise.all([
      this.propertyRepository.count(),
      this.propertyRepository.count({ where: { agence: { id: 'IS NOT NULL' } } }),
      this.propertyRepository.count({ where: { promoteur: { id: 'IS NOT NULL' } } }),
      this.propertyRepository.count({ where: { project: { id: 'IS NOT NULL' } } }),
      this.propertyRepository.count({ 
        where: { 
          propertyOwnerType: 'Agence immobilière',
          agence: IsNull()
        } 
      }),
      this.propertyRepository.count({ 
        where: { 
          propertyOwnerType: 'Promotion immobilière',
          promoteur: IsNull()
        } 
      }),
    ]);

    return {
      totalProperties,
      assignedToAgences,
      assignedToPromoteurs,
      assignedToProjects,
      unassignedAgenceProperties,
      unassignedPromoteurProperties,
      assignmentRate: totalProperties > 0 ? 
        ((assignedToAgences + assignedToPromoteurs) / totalProperties * 100).toFixed(2) : 0,
    };
  }

  /**
   * Get properties that need assignment
   */
  async getUnassignedProperties(limit: number = 50) {
    return this.propertyRepository.find({
      where: [
        { 
          propertyOwnerType: 'Agence immobilière',
          agence: IsNull(),
          propertyOwnerName: 'IS NOT NULL'
        },
        { 
          propertyOwnerType: 'Promotion immobilière',
          promoteur: IsNull(),
          propertyOwnerName: 'IS NOT NULL'
        }
      ],
      take: limit,
      order: { createdAt: 'DESC' }
    });
  }
}
