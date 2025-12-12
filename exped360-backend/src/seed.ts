import { randomUUID, webcrypto } from 'crypto';

// Ensure global crypto is available for TypeORM and other libs
if (!(global as any).crypto) {
  (global as any).crypto = webcrypto as any;
  (global as any).crypto.randomUUID = randomUUID;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PropertiesService } from './properties/properties.service';
import { UsersService } from './users/users.service';
import { CreatePropertyDto } from './properties/dto/create-property.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { PropertyType, TransactionType } from './properties/entities/property.entity';
import { UserType } from './users/entities/user.entity';
import { PaperService } from './properties/paper.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const propertiesService = app.get(PropertiesService);
  const usersService = app.get(UsersService);
  const paperService = app.get(PaperService);

  const sampleProperties: CreatePropertyDto[] = [
    {
      title: 'Appartement moderne F3 à Alger',
      description: 'Magnifique appartement F3 avec vue sur la mer, entièrement rénové avec des matériaux de qualité.',
      surface: 85,
      type: PropertyType.APARTMENT,
      transactionType: TransactionType.SALE,
      price: '25000000',
      bedrooms: 3,
      bathrooms: 2,
      wilaya: 'Alger',
      daira: 'Sidi Mhamed',
      address: 'Rue Didouche Mourad, Alger',
      propertyOwnerType: 'Particulier',
    },
    {
      title: 'Villa de luxe à Oran',
      description: 'Superbe villa de 200m² avec jardin privé, piscine et garage pour 2 voitures.',
      surface: 200,
      type: PropertyType.VILLA,
      transactionType: TransactionType.SALE,
      price: '45000000',
      bedrooms: 4,
      bathrooms: 3,
      wilaya: 'Oran',
      daira: 'Es Senia',
      address: 'Route de la Corniche, Oran',
      propertyOwnerType: 'Agence immobilière',
    },
    {
      title: 'Studio meublé à Constantine',
      description: 'Studio moderne et fonctionnel, idéal pour étudiant ou jeune professionnel.',
      surface: 35,
      type: PropertyType.STUDIO,
      transactionType: TransactionType.RENT,
      price: '25000',
      bedrooms: 1,
      bathrooms: 1,
      wilaya: 'Constantine',
      daira: 'El Khroub',
      address: 'Centre-ville, Constantine',
      propertyOwnerType: 'Particulier',
    },
    {
      title: 'Maison traditionnelle à Annaba',
      description: 'Charmante maison traditionnelle avec patio intérieur et terrasse panoramique.',
      surface: 120,
      type: PropertyType.HOUSE,
      transactionType: TransactionType.SALE,
      price: '30000000',
      bedrooms: 3,
      bathrooms: 2,
      wilaya: 'Annaba',
      daira: 'El Hadjar',
      address: 'Quartier El Bouni, Annaba',
      propertyOwnerType: 'Particulier',
    },
    {
      title: 'Terrain constructible à Tlemcen',
      description: 'Terrain de 500m² dans une zone résidentielle calme, viabilisé et prêt à construire.',
      surface: 500,
      type: PropertyType.LAND,
      transactionType: TransactionType.SALE,
      price: '15000000',
      bedrooms: 0,
      bathrooms: 0,
      wilaya: 'Tlemcen',
      daira: 'Maghnia',
      address: 'Zone résidentielle, Tlemcen',
      propertyOwnerType: 'Promotion immobilière',
    },
  ];

  const adminUser: CreateUserDto = {
    email: 'admin@exped360.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+213123456789',
    type: UserType.ADMIN
  };

  try {
    console.log('🌱 Starting database seeding...');
    
    // Seed papers
    try {
      await paperService.seedPapers();
      console.log('✅ Papers seeded successfully');
    } catch (error) {
      console.log('ℹ️  Papers already exist or error seeding papers:', error.message);
    }
    
    // Create admin user
    try {
      const user = await usersService.create(adminUser);
      console.log(`✅ Created admin user: ${user.email}`);
    } catch (error) {
      console.log('ℹ️  Admin user already exists or error creating user:', error.message);
    }
    
    // Create sample properties
    for (const propertyData of sampleProperties) {
      const property = await propertiesService.create(propertyData);
      console.log(`✅ Created property: ${property.title}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
