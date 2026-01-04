import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const existing = await this.hotelRepository.findOne({
      where: [{ name: createHotelDto.name }, { slug: createHotelDto.slug }],
    });

    if (existing) {
      throw new ConflictException('Hotel with this name or slug already exists');
    }

    const hotel = this.hotelRepository.create(createHotelDto);
    return await this.hotelRepository.save(hotel);
  }

  async findAll(): Promise<Hotel[]> {
    return await this.hotelRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { id } });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }

  async findBySlug(slug: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({ where: { slug } });
    if (!hotel) {
      throw new NotFoundException(`Hotel with slug ${slug} not found`);
    }
    return hotel;
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.findOne(id);

    if (updateHotelDto.name || updateHotelDto.slug) {
      const existing = await this.hotelRepository.findOne({
        where: [{ name: updateHotelDto.name }, { slug: updateHotelDto.slug }],
      });

      if (existing && existing.id !== hotel.id) {
        throw new ConflictException('Hotel with this name or slug already exists');
      }
    }

    await this.hotelRepository.update(id, updateHotelDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const hotel = await this.findOne(id);
    await this.hotelRepository.remove(hotel);
  }
}
