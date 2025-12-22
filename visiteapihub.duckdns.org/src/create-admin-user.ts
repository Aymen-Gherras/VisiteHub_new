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

  const defaultEmail = 'admin@exped360.com';
  const defaultPassword = 'admin123';

  const adminUser: CreateUserDto = {
    email: process.env.ADMIN_EMAIL?.trim() || defaultEmail,
    password: process.env.ADMIN_PASSWORD || defaultPassword,
    firstName: process.env.ADMIN_FIRST_NAME?.trim() || 'Admin',
    lastName: process.env.ADMIN_LAST_NAME?.trim() || 'User',
    phone: process.env.ADMIN_PHONE?.trim() || '+213123456789',
    type: UserType.ADMIN,
  };

  try {
    console.log('🔐 Creating admin user...');
    console.log(`   Target email: ${adminUser.email}`);
    
    // 1) If the target admin user exists, ensure it has admin type + (optionally) update password.
    try {
      const existingTarget = await usersService.findByEmail(adminUser.email);
      if (existingTarget) {
        // Update password only when explicitly provided via env (or when non-default target email is used).
        const shouldUpdatePassword =
          !!process.env.ADMIN_PASSWORD || (adminUser.email !== defaultEmail && adminUser.password !== defaultPassword);

        if (shouldUpdatePassword) {
          await usersService.update(existingTarget.id, {
            email: adminUser.email,
            password: adminUser.password,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            phone: adminUser.phone,
            type: adminUser.type,
          });
          console.log(`✅ Admin user updated successfully: ${adminUser.email}`);
          console.log(`   Password: ${adminUser.password}`);
        } else {
          console.log(`✅ Admin user already exists: ${adminUser.email}`);
          console.log(`   Password: ${adminUser.password}`);
        }
        await app.close();
        return;
      }
    } catch {
      // Target user doesn't exist, continue
    }

    // 2) Fresh DBs often create the default admin first; if present, upgrade it to the requested admin user.
    if (adminUser.email !== defaultEmail) {
      try {
        const existingDefault = await usersService.findByEmail(defaultEmail);
        if (existingDefault) {
          await usersService.update(existingDefault.id, {
            email: adminUser.email,
            password: adminUser.password,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            phone: adminUser.phone,
            type: adminUser.type,
          });
          console.log(`✅ Default admin upgraded to: ${adminUser.email}`);
          console.log(`   Password: ${adminUser.password}`);
          await app.close();
          return;
        }
      } catch {
        // Default doesn't exist, continue
      }
    }
    
    // Create admin user
    const user = await usersService.create(adminUser);
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${adminUser.password}`);
    console.log(`   Type: ${user.type}`);
    
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      console.log(`✅ Admin user already exists: ${adminUser.email}`);
      console.log(`   Password: ${adminUser.password}`);
    } else {
      console.error('❌ Error creating admin user:', error.message || error);
    }
  } finally {
    await app.close();
  }
}

createAdminUser();

