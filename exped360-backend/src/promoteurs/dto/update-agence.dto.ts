import { PartialType } from '@nestjs/mapped-types';
import { CreateAgenceDto } from './create-agence.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAgenceDto extends PartialType(CreateAgenceDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
