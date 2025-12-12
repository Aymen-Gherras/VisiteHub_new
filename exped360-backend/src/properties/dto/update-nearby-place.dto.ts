import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { escape } from 'html-escaper';

export class UpdateNearbyPlaceDto {
  @Transform(({ value }) => value ? escape(value.trim()) : undefined)
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => value ? escape(value.trim()) : undefined)
  @IsString()
  @IsOptional()
  distance?: string; // "300 m", "1.5 km"

  @Transform(({ value }) => value ? value.trim() : undefined)
  @IsString()
  @IsOptional()
  icon?: string; // Icon emoji

  @Transform(({ value }) => value !== undefined ? parseInt(value) : undefined)
  @IsNumber()
  @IsOptional()
  @Min(0)
  displayOrder?: number;
}

