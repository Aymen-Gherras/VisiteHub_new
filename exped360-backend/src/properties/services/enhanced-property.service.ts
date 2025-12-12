import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { Promoteur } from '../../promoteurs/entities/promoteur.entity';
import { Agence } from '../../promoteurs/entities/agence.entity';
import { Project } from '../../promoteurs/entities/project.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { PropertyAssignmentService } from '../../promoteurs/services/property-assignment.service';

export interface EnhancedCreatePropertyDto extends CreatePropertyDto {
  // New fields for entity selection
  selectedPromoteurId?: string;
  selectedAgenceId?: string;
  selectedProjectId?: string;
}

@Injectable()
export class EnhancedPropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Promoteur)
    private promoteurRepository: Repository<Promoteur>,
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private propertyAssignmentService: PropertyAssignmentService,
  ) {}

  async createPropertyWithAssignment(createPropertyDto: EnhancedCreatePropertyDto): Promise<Property> {
    // Validate the property owner type and selections
    await this.validatePropertyOwnerSelection(createPropertyDto);

    // Extract only the property fields (exclude our custom fields)
    const { selectedPromoteurId, selectedAgenceId, selectedProjectId, ...baseData } = createPropertyDto;
    
    // Create a clean property object with only valid Property entity fields
    const propertyData: Partial<Property> = {
      title: baseData.title,
      description: baseData.description,
      price: baseData.price,
      address: baseData.address,
      daira: baseData.daira,
      wilaya: baseData.wilaya,
      bedrooms: baseData.bedrooms,
      bathrooms: baseData.bathrooms,
      surface: baseData.surface,
      type: baseData.type,
      transactionType: baseData.transactionType,
      propertyOwnerType: baseData.propertyOwnerType,
      propertyOwnerName: baseData.propertyOwnerName,
      etage: baseData.etage,
      rentPeriod: baseData.rentPeriod,
      iframe360Link: baseData.iframe360Link,
      apartmentType: baseData.apartmentType,
      country: baseData.country || 'Algeria',
      // Don't include complex relations like papers, amenities, etc.
    };
    
    // Create the basic property first
    const property = this.propertyRepository.create(propertyData);
    
    // Handle assignments based on property owner type
    if (createPropertyDto.propertyOwnerType === 'Agence immobilière') {
      await this.handleAgenceAssignment(property, createPropertyDto);
    } else if (createPropertyDto.propertyOwnerType === 'Promotion immobilière') {
      await this.handlePromoteurAssignment(property, createPropertyDto);
    }
    // For 'Particulier', no additional assignment needed

    const savedProperty = await this.propertyRepository.save(property);
    
    // Auto-assign if no specific selection was made but propertyOwnerName exists
    if (!createPropertyDto.selectedAgenceId && !createPropertyDto.selectedPromoteurId && createPropertyDto.propertyOwnerName) {
      await this.propertyAssignmentService.autoAssignProperty(savedProperty);
    }

    return savedProperty;
  }

  private async validatePropertyOwnerSelection(dto: EnhancedCreatePropertyDto): Promise<void> {
    if (dto.propertyOwnerType === 'Agence immobilière') {
      if (!dto.selectedAgenceId && !dto.propertyOwnerName) {
        throw new BadRequestException('Either select an existing agence or provide agence name');
      }
      
      if (dto.selectedAgenceId) {
        const agence = await this.agenceRepository.findOne({
          where: { id: dto.selectedAgenceId, isActive: true }
        });
        if (!agence) {
          throw new NotFoundException('Selected agence not found');
        }
      }
    }

    if (dto.propertyOwnerType === 'Promotion immobilière') {
      if (!dto.selectedPromoteurId && !dto.propertyOwnerName) {
        throw new BadRequestException('Either select an existing promoteur or provide promoteur name');
      }
      
      if (dto.selectedPromoteurId) {
        const promoteur = await this.promoteurRepository.findOne({
          where: { id: dto.selectedPromoteurId, isActive: true }
        });
        if (!promoteur) {
          throw new NotFoundException('Selected promoteur not found');
        }
      }

      // Validate project if selected
      if (dto.selectedProjectId) {
        const project = await this.projectRepository.findOne({
          where: { id: dto.selectedProjectId, isActive: true },
          relations: ['promoteur']
        });
        if (!project) {
          throw new NotFoundException('Selected project not found');
        }
        
        // Ensure project belongs to the selected promoteur
        if (dto.selectedPromoteurId && project.promoteur.id !== dto.selectedPromoteurId) {
          throw new BadRequestException('Selected project does not belong to the selected promoteur');
        }
      }
    }
  }

  private async handleAgenceAssignment(property: Property, dto: EnhancedCreatePropertyDto): Promise<void> {
    if (dto.selectedAgenceId) {
      const agence = await this.agenceRepository.findOne({
        where: { id: dto.selectedAgenceId }
      });
      
      if (agence) {
        property.agence = agence;
        property.propertyOwnerName = agence.name;
      }
    }
    // If no selection but propertyOwnerName provided, it will be auto-assigned later
  }

  private async handlePromoteurAssignment(property: Property, dto: EnhancedCreatePropertyDto): Promise<void> {
    if (dto.selectedPromoteurId) {
      const promoteur = await this.promoteurRepository.findOne({
        where: { id: dto.selectedPromoteurId }
      });
      
      if (promoteur) {
        property.promoteur = promoteur;
        property.propertyOwnerName = promoteur.name;

        // Handle project assignment if selected
        if (dto.selectedProjectId) {
          const project = await this.projectRepository.findOne({
            where: { id: dto.selectedProjectId }
          });
          
          if (project) {
            property.project = project;
          }
        }
      }
    }
    // If no selection but propertyOwnerName provided, it will be auto-assigned later
  }

  async getPropertyCreationOptions() {
    const [promoteurs, agences] = await Promise.all([
      this.promoteurRepository.find({
        where: { isActive: true },
        select: ['id', 'name', 'slug', 'logo', 'wilaya'],
        order: { name: 'ASC' },
        take: 100,
      }),
      this.agenceRepository.find({
        where: { isActive: true },
        select: ['id', 'name', 'slug', 'logo', 'wilaya', 'rating'],
        order: { name: 'ASC' },
        take: 100,
      }),
    ]);

    return {
      promoteurs,
      agences,
    };
  }

  async getProjectsByPromoteur(promoteurId: string) {
    return this.projectRepository.find({
      where: { 
        promoteur: { id: promoteurId },
        isActive: true 
      },
      select: ['id', 'name', 'slug', 'location', 'status'],
      order: { name: 'ASC' },
    });
  }
}
