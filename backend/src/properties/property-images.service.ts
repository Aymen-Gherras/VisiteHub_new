import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyImage } from './entities/property-image.entity';
import { CreatePropertyImageDto } from './dto/create-property-image.dto';

@Injectable()
export class PropertyImagesService {
  constructor(
    @InjectRepository(PropertyImage)
    private propertyImagesRepository: Repository<PropertyImage>,
  ) {}

  async create(createPropertyImageDto: CreatePropertyImageDto): Promise<PropertyImage> {
    const propertyImage = this.propertyImagesRepository.create(createPropertyImageDto);
    return this.propertyImagesRepository.save(propertyImage);
  }

  async findAll(): Promise<PropertyImage[]> {
    return this.propertyImagesRepository.find();
  }

  async findByPropertyId(propertyId: string): Promise<PropertyImage[]> {
    return this.propertyImagesRepository.find({
      where: { property: { id: propertyId } },
    });
  }

  async findOne(id: string): Promise<PropertyImage> {
    const propertyImage = await this.propertyImagesRepository.findOne({
      where: { id },
    });

    if (!propertyImage) {
      throw new NotFoundException(`Property image with ID ${id} not found`);
    }

    return propertyImage;
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyImagesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Property image with ID ${id} not found`);
    }
  }
}