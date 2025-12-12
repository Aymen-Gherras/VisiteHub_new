import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';
import { AgencesService } from './agences.service';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';

@ApiTags('agences')
@Controller('agences')
export class AgencesController {
  constructor(private readonly agencesService: AgencesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new agence (Admin only)' })
  @ApiResponse({ status: 201, description: 'Agence successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Agence with this name already exists' })
  create(@Body() createAgenceDto: CreateAgenceDto) {
    return this.agencesService.create(createAgenceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agences' })
  @ApiResponse({ status: 200, description: 'Return all agences' })
  findAll() {
    return this.agencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agence by ID' })
  @ApiResponse({ status: 200, description: 'Return the agence' })
  @ApiResponse({ status: 404, description: 'Agence not found' })
  findOne(@Param('id') id: string) {
    return this.agencesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get an agence by slug' })
  @ApiResponse({ status: 200, description: 'Return the agence' })
  @ApiResponse({ status: 404, description: 'Agence not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.agencesService.findBySlug(slug);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get agence statistics' })
  @ApiResponse({ status: 200, description: 'Return agence statistics' })
  @ApiResponse({ status: 404, description: 'Agence not found' })
  getStats(@Param('id') id: string) {
    return this.agencesService.getAgenceStats(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an agence (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agence successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Agence not found' })
  @ApiResponse({ status: 409, description: 'Agence with this name already exists' })
  update(@Param('id') id: string, @Body() updateAgenceDto: UpdateAgenceDto) {
    return this.agencesService.update(id, updateAgenceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an agence (Admin only)' })
  @ApiResponse({ status: 200, description: 'Agence successfully deleted' })
  @ApiResponse({ status: 404, description: 'Agence not found' })
  remove(@Param('id') id: string) {
    return this.agencesService.remove(id);
  }
}
