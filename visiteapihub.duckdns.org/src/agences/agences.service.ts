import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Agence } from './entities/agence.entity';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class AgencesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,
    @InjectRepository(Property)
    private readonly propertiesRepository: Repository<Property>,
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
    const agences = await this.agenceRepository.find({
      order: { name: 'ASC' },
    });

    const rawCounts = await this.propertiesRepository
      .createQueryBuilder('property')
      .select('property.propertyOwnerName', 'ownerName')
      .addSelect('COUNT(1)', 'count')
      .where('property.propertyOwnerType = :ownerType', { ownerType: 'Agence immobilière' })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .groupBy('property.propertyOwnerName')
      .getRawMany<{ ownerName: string; count: string }>();

    const countByOwnerName = new Map(rawCounts.map((r) => [r.ownerName, Number(r.count || 0)]));

    return agences.map((agence) => Object.assign(agence, { propertiesCount: countByOwnerName.get(agence.name) ?? 0 }));
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

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Property).delete({
        propertyOwnerType: 'Agence immobilière',
        propertyOwnerName: agence.name,
      });
      await manager.getRepository(Agence).remove(agence);
    });
  }
}
