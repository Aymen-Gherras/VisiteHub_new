import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString, IsNumber, Min, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  imageUrl?: string; // Main project image

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  coverImage?: string; // Cover image

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[]; // Additional project images

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  address?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  wilaya?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  daira?: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  expectedCompletionDate?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  totalUnits?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  availableUnits?: number;

  @IsUUID()
  @IsNotEmpty()
  propertyOwnerId: string; // ID of the promoteur
}
