import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const existing = await this.restaurantRepository.findOne({
      where: [{ name: createRestaurantDto.name }, { slug: createRestaurantDto.slug }],
    });

    if (existing) {
      throw new ConflictException('Restaurant with this name or slug already exists');
    }

    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return await this.restaurantRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
    return restaurant;
  }

  async findBySlug(slug: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({ where: { slug } });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug ${slug} not found`);
    }
    return restaurant;
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto): Promise<Restaurant> {
    const restaurant = await this.findOne(id);

    if (updateRestaurantDto.name || updateRestaurantDto.slug) {
      const existing = await this.restaurantRepository.findOne({
        where: [{ name: updateRestaurantDto.name }, { slug: updateRestaurantDto.slug }],
      });

      if (existing && existing.id !== restaurant.id) {
        throw new ConflictException('Restaurant with this name or slug already exists');
      }
    }

    await this.restaurantRepository.update(id, updateRestaurantDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }
}
