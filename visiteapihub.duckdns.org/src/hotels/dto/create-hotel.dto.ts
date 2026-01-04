import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  wilaya?: string;

  @IsOptional()
  @IsString()
  daira?: string;

  @IsOptional()
  @IsUrl()
  iframeUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  roomsNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  starsNumber?: number;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
