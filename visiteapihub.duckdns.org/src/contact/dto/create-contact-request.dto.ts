import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyIntention } from '../entities/contact-request.entity';

export class CreateDemandeDto {
  @ApiProperty({ description: 'Contact name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Contact email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Property type' })
  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @ApiProperty({ description: 'Property location' })
  @IsNotEmpty()
  @IsString()
  propertyLocation: string;

  @ApiProperty({ description: 'Property intention (sell or rent)', enum: PropertyIntention })
  @IsNotEmpty()
  @IsEnum(PropertyIntention)
  propertyIntention: PropertyIntention;

  @ApiPropertyOptional({ description: 'Additional message' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Property images URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Contact via WhatsApp' })
  @IsOptional()
  @IsBoolean()
  whatsappContact?: boolean;

  @ApiPropertyOptional({ description: 'Contact via email' })
  @IsOptional()
  @IsBoolean()
  emailContact?: boolean;
}