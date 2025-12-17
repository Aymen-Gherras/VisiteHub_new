import { PartialType } from '@nestjs/mapped-types';
import { CreatePromoteurDto } from './create-promoteur.dto';

export class UpdatePromoteurDto extends PartialType(CreatePromoteurDto) {}
