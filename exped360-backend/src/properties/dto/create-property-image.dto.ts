import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyImageDto {
  @ApiProperty({ description: 'Image URL' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'Iframe link for 360 view' })
  @IsOptional()
  @IsString()
  iframeLink?: string;

  @ApiProperty({ description: 'Property ID' })
  @IsNotEmpty()
  @IsUUID()
  propertyId: string;
}