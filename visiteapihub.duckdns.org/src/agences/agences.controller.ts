import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgencesService } from './agences.service';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';

@Controller('agences')
export class AgencesController {
  constructor(private readonly agencesService: AgencesService) {}

  @Post()
  create(@Body() createAgenceDto: CreateAgenceDto) {
    return this.agencesService.create(createAgenceDto);
  }

  @Get()
  findAll() {
    return this.agencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agencesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.agencesService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgenceDto: UpdateAgenceDto) {
    return this.agencesService.update(id, updateAgenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agencesService.remove(id);
  }
}
