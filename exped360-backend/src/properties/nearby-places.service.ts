import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NearbyPlace } from './entities/nearby-place.entity';
import { Property } from './entities/property.entity';
import { CreateNearbyPlaceDto } from './dto/create-nearby-place.dto';
import { UpdateNearbyPlaceDto } from './dto/update-nearby-place.dto';

@Injectable()
export class NearbyPlacesService {
  constructor(
    @InjectRepository(NearbyPlace)
    private nearbyPlacesRepository: Repository<NearbyPlace>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Check if the nearby_places table exists
   */
  private async tableExists(): Promise<boolean> {
    try {
      const result = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'nearby_places'`
      );
      return result[0]?.count > 0;
    } catch (error) {
      console.error('Error checking if nearby_places table exists:', error);
      return false;
    }
  }

  async create(createNearbyPlaceDto: CreateNearbyPlaceDto): Promise<NearbyPlace> {
    // Check if table exists
    const tableExists = await this.tableExists();
    if (!tableExists) {
      throw new ServiceUnavailableException(
        'The nearby_places table does not exist. Please restart the backend server to create it automatically, or create it manually.'
      );
    }

    // Verify property exists
    const property = await this.propertiesRepository.findOne({
      where: { id: createNearbyPlaceDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${createNearbyPlaceDto.propertyId} not found`);
    }

    try {
      // Check max limit (10 places per property) using query builder for reliability
      const existingCountResult = await this.nearbyPlacesRepository
        .createQueryBuilder('nearbyPlace')
        .where('nearbyPlace.property_id = :propertyId', { propertyId: createNearbyPlaceDto.propertyId })
        .getCount();

      if (existingCountResult >= 10) {
        throw new BadRequestException('Maximum of 10 nearby places per property allowed');
      }

      // Use raw SQL query to insert, which is more reliable than TypeORM entity save
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        // Check which columns exist in the table
        const columns = await queryRunner.query(
          `SELECT COLUMN_NAME FROM information_schema.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() 
             AND TABLE_NAME = 'nearby_places'`
        );
        const columnNames = columns.map((col: any) => col.COLUMN_NAME);
        
        const hasCreatedAt = columnNames.includes('created_at');
        const hasUpdatedAt = columnNames.includes('updated_at');

        // Generate UUID for the new nearby place
        const [uuidResult] = await queryRunner.query('SELECT UUID() as uuid');
        const newId = uuidResult.uuid;

        // Build INSERT statement - omit timestamp columns if they have DEFAULT values
        // MySQL will automatically set them if they have DEFAULT CURRENT_TIMESTAMP
        const insertColumns = ['id', 'property_id', 'name', 'distance', 'icon', 'display_order'];
        const insertValues: any[] = [
          newId,
          createNearbyPlaceDto.propertyId,
          createNearbyPlaceDto.name,
          createNearbyPlaceDto.distance,
          createNearbyPlaceDto.icon ?? '📍',
          createNearbyPlaceDto.displayOrder ?? existingCountResult,
        ];

        // Insert using raw SQL to avoid TypeORM relationship issues
        // Omit created_at and updated_at - let MySQL use DEFAULT values if they exist
        const placeholders = insertValues.map(() => '?').join(', ');
        await queryRunner.query(
          `INSERT INTO nearby_places (${insertColumns.join(', ')}) VALUES (${placeholders})`,
          insertValues
        );

        // Fetch the created nearby place
        const [createdPlace] = await queryRunner.query(
          `SELECT * FROM nearby_places WHERE id = ?`,
          [newId]
        );

        // Map the raw result to match the entity structure
        const nearbyPlace: NearbyPlace = {
          id: createdPlace.id,
          name: createdPlace.name,
          distance: createdPlace.distance,
          icon: createdPlace.icon,
          displayOrder: createdPlace.display_order || createdPlace.displayOrder || 0,
          createdAt: createdPlace.created_at || createdPlace.createdAt || new Date(),
          updatedAt: createdPlace.updated_at || createdPlace.updatedAt || new Date(),
          property: property as any, // TypeORM will handle this
        };

        return nearbyPlace as NearbyPlace;
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      // Log the full error for debugging
      console.error('Error creating nearby place:', error);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('SQL Message:', error?.sqlMessage);
      console.error('Stack:', error?.stack);

      // If error is about table not existing, provide helpful message
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      
      if (errorMessage.includes('nearby_places') || errorCode === 'er_no_such_table' || errorCode === '42s02' || sqlMessage.includes('nearby_places') || errorMessage.includes('doesn\'t exist')) {
        throw new ServiceUnavailableException(
          'The nearby_places table does not exist. Please restart the backend server to create it automatically, or create it manually.'
        );
      }
      
      // Re-throw BadRequestException and NotFoundException as-is
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      // For other errors, wrap in a more user-friendly message
      throw new BadRequestException(`Failed to create nearby place: ${error?.message || 'Unknown error'}`);
    }
  }

  async findAllByProperty(propertyId: string): Promise<NearbyPlace[]> {
    // Check if table exists
    const tableExists = await this.tableExists();
    if (!tableExists) {
      // Return empty array if table doesn't exist (graceful degradation)
      console.log('⚠️ nearby_places table not found, returning empty array');
      return [];
    }

    try {
      // Use query builder to handle potential column name issues
      const nearbyPlaces = await this.nearbyPlacesRepository
        .createQueryBuilder('nearbyPlace')
        .where('nearbyPlace.property_id = :propertyId', { propertyId })
        .orderBy('nearbyPlace.display_order', 'ASC')
        .addOrderBy('nearbyPlace.created_at', 'ASC')
        .getMany();
      
      return nearbyPlaces;
    } catch (error: any) {
      // Log the error for debugging
      console.error('Error in findAllByProperty:', error?.message || error);
      console.error('Error code:', error?.code);
      console.error('SQL Message:', error?.sqlMessage);
      
      // If error is about table not existing, return empty array (graceful degradation)
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      
      if (errorMessage.includes('nearby_places') || errorCode === 'er_no_such_table' || errorCode === '42s02' || sqlMessage.includes('nearby_places') || errorMessage.includes('doesn\'t exist') || errorMessage.includes('unknown column')) {
        console.log('⚠️ nearby_places table/column issue detected, returning empty array');
        return [];
      }
      
      // For any other error, return empty array instead of throwing (graceful degradation)
      console.log('⚠️ Unexpected error in findAllByProperty, returning empty array');
      return [];
    }
  }

  async findOne(id: string): Promise<NearbyPlace> {
    // Check if table exists
    const tableExists = await this.tableExists();
    if (!tableExists) {
      throw new NotFoundException(`Nearby place with ID ${id} not found`);
    }

    try {
      const nearbyPlace = await this.nearbyPlacesRepository.findOne({
        where: { id },
        relations: ['property'],
      });

      if (!nearbyPlace) {
        throw new NotFoundException(`Nearby place with ID ${id} not found`);
      }

      return nearbyPlace;
    } catch (error: any) {
      // If error is about table not existing, return not found
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      
      if (errorMessage.includes('nearby_places') || errorCode === 'er_no_such_table' || errorCode === '42s02' || sqlMessage.includes('nearby_places') || errorMessage.includes('doesn\'t exist')) {
        throw new NotFoundException(`Nearby place with ID ${id} not found`);
      }
      throw error;
    }
  }

  async update(id: string, updateNearbyPlaceDto: UpdateNearbyPlaceDto): Promise<NearbyPlace> {
    // Check if table exists
    const tableExists = await this.tableExists();
    if (!tableExists) {
      throw new ServiceUnavailableException(
        'The nearby_places table does not exist. Please restart the backend server to create it automatically, or create it manually.'
      );
    }

    try {
      const nearbyPlace = await this.findOne(id);
      Object.assign(nearbyPlace, updateNearbyPlaceDto);
      return this.nearbyPlacesRepository.save(nearbyPlace);
    } catch (error: any) {
      // If error is about table not existing, provide helpful message
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      
      if (errorMessage.includes('nearby_places') || errorCode === 'er_no_such_table' || errorCode === '42s02' || sqlMessage.includes('nearby_places') || errorMessage.includes('doesn\'t exist')) {
        throw new ServiceUnavailableException(
          'The nearby_places table does not exist. Please restart the backend server to create it automatically, or create it manually.'
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    // Check if table exists
    const tableExists = await this.tableExists();
    if (!tableExists) {
      throw new NotFoundException(`Nearby place with ID ${id} not found`);
    }

    try {
      // First check if the nearby place exists using raw SQL for reliability
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        // Check if nearby place exists
        const [existing] = await queryRunner.query(
          `SELECT id FROM nearby_places WHERE id = ?`,
          [id]
        );

        if (!existing) {
          throw new NotFoundException(`Nearby place with ID ${id} not found`);
        }

        // Delete using raw SQL
        const result = await queryRunner.query(
          `DELETE FROM nearby_places WHERE id = ?`,
          [id]
        );

        // Check if deletion was successful (MySQL returns affectedRows)
        if (result.affectedRows === 0) {
          throw new NotFoundException(`Nearby place with ID ${id} not found`);
        }
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      // Log the full error for debugging
      console.error('Error removing nearby place:', error);
      console.error('Error message:', error?.message);
      console.error('Error code:', error?.code);
      console.error('SQL Message:', error?.sqlMessage);

      // If error is NotFoundException, re-throw as-is
      if (error instanceof NotFoundException) {
        throw error;
      }

      // If error is about table not existing, return not found
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      
      if (errorMessage.includes('nearby_places') || errorCode === 'er_no_such_table' || errorCode === '42s02' || sqlMessage.includes('nearby_places') || errorMessage.includes('doesn\'t exist')) {
        throw new NotFoundException(`Nearby place with ID ${id} not found`);
      }
      
      // For other errors, throw as NotFoundException to match expected behavior
      throw new NotFoundException(`Nearby place with ID ${id} not found`);
    }
  }

  async removeAllByProperty(propertyId: string): Promise<void> {
    // Check if table exists
    const tableExists = await this.tableExists();
    if (!tableExists) {
      // If table doesn't exist, there's nothing to delete, so just return
      return;
    }

    try {
      await this.nearbyPlacesRepository.delete({ property: { id: propertyId } });
    } catch (error: any) {
      // If error is about table not existing, just return (nothing to delete)
      const errorMessage = String(error?.message || '').toLowerCase();
      const errorCode = String(error?.code || '').toLowerCase();
      const sqlMessage = String(error?.sqlMessage || '').toLowerCase();
      
      if (errorMessage.includes('nearby_places') || errorCode === 'er_no_such_table' || errorCode === '42s02' || sqlMessage.includes('nearby_places') || errorMessage.includes('doesn\'t exist')) {
        // Table doesn't exist, nothing to delete
        return;
      }
      throw error;
    }
  }
}

