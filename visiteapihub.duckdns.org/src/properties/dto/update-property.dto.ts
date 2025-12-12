import { PartialType } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';
import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { escape } from 'validator';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  // Allow updating the view count explicitly
  @IsOptional()
  @IsNumber()
  viewCount?: number;

  // Allow updating property owner type
  @Transform(({ value }) => value ? escape(value?.trim()) : undefined)
  @IsOptional()
  @IsString()
  propertyOwnerType?: string; // 'Particulier', 'Agence immobilière', 'Promotion immobilière'

  // Allow updating property owner name
  @Transform(({ value }) => value ? escape(value?.trim()) : undefined)
  @IsOptional()
  @IsString()
  propertyOwnerName?: string; // Name of agency or promotion company (only for 'Agence immobilière' or 'Promotion immobilière')

  // Allow updating apartment type
  @IsOptional()
  @IsString()
  apartmentType?: string;

  // Allow updating country
  @IsOptional()
  @IsString()
  country?: string;

  // Allow updating latitude
  @IsOptional()
  @IsNumber()
  latitude?: number;

  // Allow updating longitude
  @IsOptional()
  @IsNumber()
  longitude?: number;

  // Allow updating papers
  @IsOptional()
  @IsArray()
  papers?: string[];

  // Allow updating slug explicitly (rare)
  @IsOptional()
  @IsString()
  slug?: string;

  // Allow updating featured flag
  @IsOptional()
  isFeatured?: boolean;
}