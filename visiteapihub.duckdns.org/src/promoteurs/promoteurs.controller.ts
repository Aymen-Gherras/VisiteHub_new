import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromoteursService } from './promoteurs.service';
import { CreatePromoteurDto } from './dto/create-promoteur.dto';
import { UpdatePromoteurDto } from './dto/update-promoteur.dto';

@Controller('promoteurs')
export class PromoteursController {
  constructor(private readonly promoteursService: PromoteursService) {}

  @Post()
  create(@Body() createPromoteurDto: CreatePromoteurDto) {
    return this.promoteursService.create(createPromoteurDto);
  }

  @Get()
  findAll() {
    return this.promoteursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promoteursService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.promoteursService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromoteurDto: UpdatePromoteurDto) {
    return this.promoteursService.update(id, updatePromoteurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promoteursService.remove(id);
  }
}
