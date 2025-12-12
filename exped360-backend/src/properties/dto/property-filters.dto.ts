import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PropertyType, TransactionType } from '../entities/property.entity';

export class PropertyFiltersDto {
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  minBedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  maxBedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  minBathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(20)
  maxBathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minSurface?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxSurface?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  wilaya?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().toLowerCase())
  daira?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  propertyOwnerType?: string; // 'Particulier', 'Agence immobilière', 'Promotion immobilière'

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  has360Tour?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(['price_asc', 'price_desc', 'surface_asc', 'surface_desc', 'newest', 'oldest', 'most_viewed'])
  sortBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
