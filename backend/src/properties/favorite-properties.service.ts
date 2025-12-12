import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteProperty } from './entities/favorite-property.entity';

@Injectable()
export class FavoritePropertiesService {
  constructor(
    @InjectRepository(FavoriteProperty)
    private favoritePropertiesRepository: Repository<FavoriteProperty>,
  ) {}

  async addToFavorites(userId: string, propertyId: string): Promise<FavoriteProperty> {
    // Check if already in favorites
    const existing = await this.favoritePropertiesRepository.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });

    if (existing) {
      throw new ConflictException('Property already in favorites');
    }

    const favoriteProperty = this.favoritePropertiesRepository.create({
      user: { id: userId },
      property: { id: propertyId },
    });

    return this.favoritePropertiesRepository.save(favoriteProperty);
  }

  async findAllByUserId(userId: string): Promise<FavoriteProperty[]> {
    return this.favoritePropertiesRepository.find({
      where: { user: { id: userId } },
      relations: ['property', 'property.images'],
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.favoritePropertiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Favorite property with ID ${id} not found`);
    }
  }

  async removeByUserAndProperty(userId: string, propertyId: string): Promise<void> {
    const favoriteProperty = await this.favoritePropertiesRepository.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });

    if (!favoriteProperty) {
      throw new NotFoundException('Favorite property not found');
    }

    await this.favoritePropertiesRepository.remove(favoriteProperty);
  }
}