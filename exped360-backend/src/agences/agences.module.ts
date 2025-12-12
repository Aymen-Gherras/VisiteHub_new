import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agence } from './entities/agence.entity';
import { AgencesService } from './agences.service';
import { AgencesController } from './agences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Agence])],
  controllers: [AgencesController],
  providers: [AgencesService],
  exports: [AgencesService],
})
export class AgencesModule {}
