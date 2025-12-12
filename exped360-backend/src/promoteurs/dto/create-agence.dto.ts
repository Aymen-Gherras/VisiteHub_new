import { IsString, IsOptional, IsEmail, IsUrl, IsNotEmpty, MaxLength, IsNumber, Min, Max, IsBoolean, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAgenceDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @Transform(({ value }) => value?.trim())
  @IsUrl({}, { message: 'Website must be a valid URL' })
  @IsOptional()
  website?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  phone?: string;

  @Transform(({ value }) => value?.trim())
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

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

  @IsString()
  @IsOptional()
  socialMedia?: string; // JSON string

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsDateString()
  @IsOptional()
  licenseExpiry?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  foundedYear?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  agentCount?: number;

  @IsString()
  @IsOptional()
  specializations?: string; // JSON string

  @IsString()
  @IsOptional()
  serviceAreas?: string; // JSON string

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;
}
