import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyOwnerType } from '../entities/property-owner.entity';

export class CreatePropertyOwnerDto {
  @ApiProperty({ description: 'Name of the property owner (agence or promoteur)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'URL-friendly slug (auto-generated if not provided)' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ 
    enum: PropertyOwnerType, 
    description: 'Type of property owner: agence or promoteur' 
  })
  @IsEnum(PropertyOwnerType)
  type: PropertyOwnerType;

  @ApiPropertyOptional({ description: 'Logo/image URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Description of the property owner' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Cover image URL for profile page' })
  @IsString()
  @IsOptional()
  coverImage?: string;
}
