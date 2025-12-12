import { randomUUID, webcrypto } from 'crypto';

// Ensure global crypto is available for TypeORM and other libs
if (!(global as any).crypto) {
  (global as any).crypto = webcrypto as any;
  (global as any).crypto.randomUUID = randomUUID;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserType } from './users/entities/user.entity';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminUser: CreateUserDto = {
    email: 'admin@exped360.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+213123456789',
    type: UserType.ADMIN,
  };

  try {
    console.log('🔐 Creating admin user...');
    
    // Check if user already exists
    try {
      const existingUser = await usersService.findByEmail(adminUser.email);
      if (existingUser) {
        console.log(`✅ Admin user already exists: ${adminUser.email}`);
        console.log('   Password: admin123');
        await app.close();
        return;
      }
    } catch (error) {
      // User doesn't exist, proceed with creation
    }
    
    // Create admin user
    const user = await usersService.create(adminUser);
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Type: ${user.type}`);
    
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log(`✅ Admin user already exists: ${adminUser.email}`);
      console.log('   Password: admin123');
    } else {
      console.error('❌ Error creating admin user:', error.message || error);
    }
  } finally {
    await app.close();
  }
}

createAdminUser();

