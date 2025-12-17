import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoteursService } from './promoteurs.service';
import { PromoteursController } from './promoteurs.controller';
import { Promoteur } from './entities/promoteur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promoteur])],
  controllers: [PromoteursController],
  providers: [PromoteursService],
  exports: [PromoteursService],
})
export class PromoteursModule {}
