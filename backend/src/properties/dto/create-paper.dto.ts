import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaperDto {
  @ApiProperty({ description: 'Paper name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
