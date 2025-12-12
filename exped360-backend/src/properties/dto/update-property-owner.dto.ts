import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreatePropertyOwnerDto } from './create-property-owner.dto';

export class UpdatePropertyOwnerDto extends PartialType(CreatePropertyOwnerDto) {
  @IsOptional()
  @IsString()
  slug?: string;
}
