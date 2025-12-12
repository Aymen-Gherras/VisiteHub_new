import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { escape } from 'html-escaper';

export class CreateNearbyPlaceDto {
  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => escape(value?.trim()))
  @IsString()
  @IsNotEmpty()
  distance: string; // "300 m", "1.5 km"

  @Transform(({ value }) => value?.trim() || '📍')
  @IsString()
  @IsOptional()
  icon?: string; // Icon emoji, defaults to '📍'

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  @Min(0)
  displayOrder?: number;

  @IsUUID()
  @IsNotEmpty()
  propertyId: string;
}

