import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoteurDto } from './create-promoteur.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePromoteurDto extends PartialType(CreatePromoteurDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
