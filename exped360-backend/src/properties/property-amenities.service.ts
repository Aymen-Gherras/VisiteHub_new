import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyAmenity } from './entities/property-amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class PropertyAmenitiesService {
  constructor(
    @InjectRepository(PropertyAmenity)
    private propertyAmenitiesRepository: Repository<PropertyAmenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto): Promise<PropertyAmenity> {
    const amenity = this.propertyAmenitiesRepository.create(createAmenityDto);
    return this.propertyAmenitiesRepository.save(amenity);
  }

  async findAll(): Promise<PropertyAmenity[]> {
    return this.propertyAmenitiesRepository.find();
  }

  async findOne(id: string): Promise<PropertyAmenity> {
    const amenity = await this.propertyAmenitiesRepository.findOne({
      where: { id },
    });

    if (!amenity) {
      throw new NotFoundException(`Property amenity with ID ${id} not found`);
    }

    return amenity;
  }

  async update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<PropertyAmenity> {
    const amenity = await this.findOne(id);
    Object.assign(amenity, updateAmenityDto);
    return this.propertyAmenitiesRepository.save(amenity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyAmenitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property amenity with ID ${id} not found`);
    }
  }
}