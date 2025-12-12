import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paper } from './entities/paper.entity';

@Injectable()
export class PaperService {
  constructor(
    @InjectRepository(Paper)
    private paperRepository: Repository<Paper>,
  ) {}

  async create(name: string): Promise<Paper> {
    const paper = this.paperRepository.create({ name });
    return this.paperRepository.save(paper);
  }

  async findAll(): Promise<Paper[]> {
    return this.paperRepository.find();
  }

  async findById(id: string): Promise<Paper> {
    const paper = await this.paperRepository.findOne({ where: { id } });
    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return paper;
  }

  async findByName(name: string): Promise<Paper | null> {
    return this.paperRepository.findOne({ where: { name } });
  }

  async update(id: string, name: string): Promise<Paper> {
    const paper = await this.findById(id);
    paper.name = name;
    return this.paperRepository.save(paper);
  }

  async delete(id: string): Promise<void> {
    const paper = await this.findById(id);
    await this.paperRepository.remove(paper);
  }

  async seedPapers(): Promise<void> {
    const defaultPapers = [
      'Décision',
      'Promotion immobilière',
      'Acte notarié',
      'Acte dans l\'indivision',
      'Papier timbré',
      'Livret foncier',
      'Permis de construire'
    ];

    for (const paperName of defaultPapers) {
      const existingPaper = await this.findByName(paperName);
      if (!existingPaper) {
        await this.create(paperName);
      }
    }
  }
}
