import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaperService } from './paper.service';
import { CreatePaperDto } from './dto/create-paper.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';

@ApiTags('papers')
@Controller('papers')
export class PaperController {
  constructor(private readonly paperService: PaperService) {}

  @Get()
  @ApiOperation({ summary: 'Get all papers' })
  @ApiResponse({ status: 200, description: 'List of all papers' })
  async findAll() {
    return this.paperService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get paper by ID' })
  @ApiResponse({ status: 200, description: 'Paper found' })
  @ApiResponse({ status: 404, description: 'Paper not found' })
  async findById(@Param('id') id: string) {
    return this.paperService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new paper (Admin only)' })
  @ApiResponse({ status: 201, description: 'Paper created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async create(@Body() createPaperDto: CreatePaperDto) {
    return this.paperService.create(createPaperDto.name);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update paper by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Paper updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Paper not found' })
  async update(@Param('id') id: string, @Body() createPaperDto: CreatePaperDto) {
    return this.paperService.update(id, createPaperDto.name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete paper by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Paper deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Paper not found' })
  async delete(@Param('id') id: string) {
    await this.paperService.delete(id);
    return { message: 'Paper deleted successfully' };
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed default papers (Admin only)' })
  @ApiResponse({ status: 200, description: 'Default papers seeded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async seedPapers() {
    await this.paperService.seedPapers();
    return { message: 'Default papers seeded successfully' };
  }
}
