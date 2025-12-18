import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencesService } from './agences.service';
import { AgencesController } from './agences.controller';
import { Agence } from './entities/agence.entity';
import { Property } from '../properties/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agence, Property])],
  controllers: [AgencesController],
  providers: [AgencesService],
  exports: [AgencesService],
})
export class AgencesModule {}
