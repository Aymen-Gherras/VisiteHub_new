import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promoteur } from './entities/promoteur.entity';
import { CreatePromoteurDto } from './dto/create-promoteur.dto';
import { UpdatePromoteurDto } from './dto/update-promoteur.dto';

@Injectable()
export class PromoteursService {
  constructor(
    @InjectRepository(Promoteur)
    private promoteurRepository: Repository<Promoteur>,
  ) {}

  async create(createPromoteurDto: CreatePromoteurDto): Promise<Promoteur> {
    const existing = await this.promoteurRepository.findOne({
      where: [
        { name: createPromoteurDto.name },
        { slug: createPromoteurDto.slug },
      ],
    });

    if (existing) {
      throw new ConflictException('Promoteur with this name or slug already exists');
    }

    const promoteur = this.promoteurRepository.create(createPromoteurDto);
    return await this.promoteurRepository.save(promoteur);
  }

  async findAll(): Promise<Promoteur[]> {
    return await this.promoteurRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({ where: { id } });
    if (!promoteur) {
      throw new NotFoundException(`Promoteur with ID ${id} not found`);
    }
    return promoteur;
  }

  async findBySlug(slug: string): Promise<Promoteur> {
    const promoteur = await this.promoteurRepository.findOne({ where: { slug } });
    if (!promoteur) {
      throw new NotFoundException(`Promoteur with slug ${slug} not found`);
    }
    return promoteur;
  }

  async update(id: string, updatePromoteurDto: UpdatePromoteurDto): Promise<Promoteur> {
    const promoteur = await this.findOne(id);

    if (updatePromoteurDto.name || updatePromoteurDto.slug) {
      const existing = await this.promoteurRepository.findOne({
        where: [
          { name: updatePromoteurDto.name },
          { slug: updatePromoteurDto.slug },
        ],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Promoteur with this name or slug already exists');
      }
    }

    await this.promoteurRepository.update(id, updatePromoteurDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const promoteur = await this.findOne(id);
    await this.promoteurRepository.remove(promoteur);
  }
}
