import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
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
  @IsString()
  type?: string;

  @IsOptional()
  @IsUrl()
  iframeUrl?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
