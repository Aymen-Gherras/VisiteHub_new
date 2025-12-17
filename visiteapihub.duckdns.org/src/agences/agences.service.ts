import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agence } from './entities/agence.entity';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';

@Injectable()
export class AgencesService {
  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,
  ) {}

  async create(createAgenceDto: CreateAgenceDto): Promise<Agence> {
    // Check if agence with same name already exists
    const existing = await this.agenceRepository.findOne({
      where: [
        { name: createAgenceDto.name },
        { slug: createAgenceDto.slug },
      ],
    });

    if (existing) {
      throw new ConflictException('Agence with this name or slug already exists');
    }

    const agence = this.agenceRepository.create(createAgenceDto);
    return await this.agenceRepository.save(agence);
  }

  async findAll(): Promise<Agence[]> {
    return await this.agenceRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({ where: { id } });
    if (!agence) {
      throw new NotFoundException(`Agence with ID ${id} not found`);
    }
    return agence;
  }

  async findBySlug(slug: string): Promise<Agence> {
    const agence = await this.agenceRepository.findOne({ where: { slug } });
    if (!agence) {
      throw new NotFoundException(`Agence with slug ${slug} not found`);
    }
    return agence;
  }

  async update(id: string, updateAgenceDto: UpdateAgenceDto): Promise<Agence> {
    const agence = await this.findOne(id);

    // Check if updating name/slug conflicts with existing
    if (updateAgenceDto.name || updateAgenceDto.slug) {
      const existing = await this.agenceRepository.findOne({
        where: [
          { name: updateAgenceDto.name },
          { slug: updateAgenceDto.slug },
        ],
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Agence with this name or slug already exists');
      }
    }

    await this.agenceRepository.update(id, updateAgenceDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const agence = await this.findOne(id);
    await this.agenceRepository.remove(agence);
  }
}
