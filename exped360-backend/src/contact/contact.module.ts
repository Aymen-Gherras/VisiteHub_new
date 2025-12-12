import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Demande } from './entities/contact-request.entity';
import { DemandeService } from './contact.service';
import { DemandeController } from './contact.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Demande]), ConfigModule, CloudinaryModule],
  controllers: [DemandeController],
  providers: [DemandeService],
  exports: [DemandeService],
})
export class DemandeModule {}