import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';

export class CreatePromoteurDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  wilaya?: string;

  @IsOptional()
  @IsString()
  daira?: string;

  @IsOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
