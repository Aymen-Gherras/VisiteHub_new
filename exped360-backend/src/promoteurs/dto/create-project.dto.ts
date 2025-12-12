import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsArray, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({ description: 'Name of the project' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the project' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Array of image URLs for project gallery' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Project address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Wilaya (province)' })
  @IsOptional()
  @IsString()
  wilaya?: string;

  @ApiPropertyOptional({ description: 'Daira (district)' })
  @IsOptional()
  @IsString()
  daira?: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Project start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Expected completion date' })
  @IsOptional()
  @IsDateString()
  expectedCompletionDate?: string;

  @ApiPropertyOptional({ description: 'Project status', enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Completion percentage (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage?: number;

  @ApiPropertyOptional({ description: 'Project amenities (JSON string)' })
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiProperty({ description: 'ID of the promoteur who owns this project' })
  @IsUUID()
  promoteurId: string;
}
