# 🗄️ Phase 3: Database Migration (Optional)

## ⚠️ Important Notice

**This is OPTIONAL and only recommended after Phase 1 & 2 are working well.**

The virtual system (Phase 1-2) provides all the functionality you need. Only proceed with database migration if you need:
- Advanced relationships between entities
- Complex queries and reporting
- Audit trails and history
- Multi-tenant features

## 📋 Migration Overview

This phase converts the virtual system to a full database-backed system while maintaining backward compatibility.

---

## 🗂️ Database Schema

### 1. Create Tables

```sql
-- migrations/001-create-promoteurs-agences-projects.sql

-- Create Promoteurs table
CREATE TABLE IF NOT EXISTS `promoteurs` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL UNIQUE,
  `slug` varchar(255) NULL UNIQUE,
  `description` text NULL,
  `logo` varchar(500) NULL,
  `website` varchar(500) NULL,
  `phone` varchar(50) NULL,
  `email` varchar(255) NULL,
  `address` varchar(500) NULL,
  `wilaya` varchar(100) NULL,
  `daira` varchar(100) NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_promoteurs_slug` (`slug`),
  INDEX `IDX_promoteurs_name` (`name`),
  INDEX `IDX_promoteurs_wilaya` (`wilaya`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Agences table
CREATE TABLE IF NOT EXISTS `agences` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL UNIQUE,
  `slug` varchar(255) NULL UNIQUE,
  `description` text NULL,
  `logo` varchar(500) NULL,
  `website` varchar(500) NULL,
  `phone` varchar(50) NULL,
  `email` varchar(255) NULL,
  `address` varchar(500) NULL,
  `wilaya` varchar(100) NULL,
  `daira` varchar(100) NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_agences_slug` (`slug`),
  INDEX `IDX_agences_name` (`name`),
  INDEX `IDX_agences_wilaya` (`wilaya`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Projects table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL UNIQUE,
  `slug` varchar(255) NULL UNIQUE,
  `description` text NULL,
  `coverImage` varchar(500) NULL,
  `images` text NULL,
  `location` varchar(255) NULL,
  `wilaya` varchar(100) NULL,
  `daira` varchar(100) NULL,
  `startDate` date NULL,
  `expectedCompletionDate` date NULL,
  `status` enum('planning','construction','completed','on_hold') NOT NULL DEFAULT 'planning',
  `totalUnits` int NOT NULL DEFAULT 0,
  `availableUnits` int NOT NULL DEFAULT 0,
  `minPrice` decimal(15,2) NULL,
  `maxPrice` decimal(15,2) NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `promoteurId` varchar(36) NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `IDX_projects_slug` (`slug`),
  INDEX `IDX_projects_status` (`status`),
  INDEX `IDX_projects_wilaya` (`wilaya`),
  INDEX `IDX_projects_promoteurId` (`promoteurId`),
  CONSTRAINT `FK_projects_promoteur` FOREIGN KEY (`promoteurId`) REFERENCES `promoteurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Add Foreign Keys to Properties

```sql
-- migrations/002-add-property-relationships.sql

-- Add new foreign key columns to properties table (nullable for backward compatibility)
ALTER TABLE `properties` 
ADD COLUMN `agenceId` varchar(36) NULL,
ADD COLUMN `promoteurId` varchar(36) NULL,
ADD COLUMN `projectId` varchar(36) NULL;

-- Add indexes for the new foreign keys
ALTER TABLE `properties` 
ADD INDEX `IDX_properties_agenceId` (`agenceId`),
ADD INDEX `IDX_properties_promoteurId` (`promoteurId`),
ADD INDEX `IDX_properties_projectId` (`projectId`);

-- Add foreign key constraints
ALTER TABLE `properties` 
ADD CONSTRAINT `FK_properties_agence` FOREIGN KEY (`agenceId`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `FK_properties_promoteur` FOREIGN KEY (`promoteurId`) REFERENCES `promoteurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `FK_properties_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
```

### 3. Data Migration Script

```sql
-- migrations/003-migrate-existing-data.sql

-- Generate UUIDs function (MySQL 8.0+)
-- For older MySQL versions, you'll need to use a different approach

-- Step 1: Create Promoteurs from existing properties
INSERT INTO `promoteurs` (`id`, `name`, `slug`, `createdAt`, `updatedAt`)
SELECT 
    UUID() as id,
    `propertyOwnerName` as name,
    LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(`propertyOwnerName`, 'é', 'e'),
                                        'è', 'e'
                                    ),
                                    'à', 'a'
                                ),
                                'ç', 'c'
                            ),
                            ' ', '-'
                        ),
                        '&', 'et'
                    ),
                    '.', ''
                ),
                '--', '-'
            ),
            '/', '-'
        )
    ) as slug,
    NOW() as createdAt,
    NOW() as updatedAt
FROM `properties` 
WHERE `propertyOwnerType` = 'Promotion immobilière' 
    AND `propertyOwnerName` IS NOT NULL 
    AND `propertyOwnerName` != ''
    AND `propertyOwnerName` NOT IN (SELECT `name` FROM `promoteurs`)
GROUP BY `propertyOwnerName`;

-- Step 2: Create Agences from existing properties
INSERT INTO `agences` (`id`, `name`, `slug`, `createdAt`, `updatedAt`)
SELECT 
    UUID() as id,
    `propertyOwnerName` as name,
    LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(`propertyOwnerName`, 'é', 'e'),
                                        'è', 'e'
                                    ),
                                    'à', 'a'
                                ),
                                'ç', 'c'
                            ),
                            ' ', '-'
                        ),
                        '&', 'et'
                    ),
                    '.', ''
                ),
                '--', '-'
            ),
            '/', '-'
        )
    ) as slug,
    NOW() as createdAt,
    NOW() as updatedAt
FROM `properties` 
WHERE `propertyOwnerType` = 'Agence immobilière' 
    AND `propertyOwnerName` IS NOT NULL 
    AND `propertyOwnerName` != ''
    AND `propertyOwnerName` NOT IN (SELECT `name` FROM `agences`)
GROUP BY `propertyOwnerName`;

-- Step 3: Link properties to promoteurs
UPDATE `properties` p
JOIN `promoteurs` pr ON p.`propertyOwnerName` = pr.`name`
SET p.`promoteurId` = pr.`id`
WHERE p.`propertyOwnerType` = 'Promotion immobilière'
    AND p.`propertyOwnerName` IS NOT NULL
    AND p.`propertyOwnerName` != '';

-- Step 4: Link properties to agences
UPDATE `properties` p
JOIN `agences` a ON p.`propertyOwnerName` = a.`name`
SET p.`agenceId` = a.`id`
WHERE p.`propertyOwnerType` = 'Agence immobilière'
    AND p.`propertyOwnerName` IS NOT NULL
    AND p.`propertyOwnerName` != '';
```

### 4. Configuration Migration Script

```sql
-- migrations/004-migrate-configuration-data.sql

-- Update promoteurs with configuration data
-- This script reads from your config files and updates the database
-- You'll need to run this via a Node.js script, not pure SQL

-- See the Node.js migration script below
```

---

## 🔧 Node.js Migration Scripts

### 1. Configuration Migration Script

```typescript
// scripts/migrate-config-to-db.ts
import { createConnection } from 'typeorm';
import { Promoteur } from '../src/promoteurs/entities/promoteur.entity';
import { Agence } from '../src/promoteurs/entities/agence.entity';
import * as promoteursConfig from '../src/config/promoteurs-config.json';
import * as agencesConfig from '../src/config/agences-config.json';

async function migrateConfigToDatabase() {
  const connection = await createConnection();
  
  try {
    console.log('🔄 Migrating promoteurs configuration...');
    
    // Migrate promoteurs config
    const promoteurRepository = connection.getRepository(Promoteur);
    
    for (const [slug, config] of Object.entries(promoteursConfig as any)) {
      const promoteur = await promoteurRepository.findOne({ where: { slug } });
      
      if (promoteur) {
        await promoteurRepository.update(promoteur.id, {
          description: config.description,
          logo: config.logo,
          website: config.website,
          phone: config.phone,
          email: config.email,
          address: config.address,
          wilaya: config.wilaya,
          daira: config.daira,
        });
        
        console.log(`✅ Updated promoteur: ${promoteur.name}`);
      }
    }
    
    console.log('🔄 Migrating agences configuration...');
    
    // Migrate agences config
    const agenceRepository = connection.getRepository(Agence);
    
    for (const [slug, config] of Object.entries(agencesConfig as any)) {
      const agence = await agenceRepository.findOne({ where: { slug } });
      
      if (agence) {
        await agenceRepository.update(agence.id, {
          description: config.description,
          logo: config.logo,
          website: config.website,
          phone: config.phone,
          email: config.email,
          address: config.address,
          wilaya: config.wilaya,
          daira: config.daira,
        });
        
        console.log(`✅ Updated agence: ${agence.name}`);
      }
    }
    
    console.log('🎉 Configuration migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.close();
  }
}

migrateConfigToDatabase();
```

### 2. Project Creation Script

```typescript
// scripts/create-projects-from-properties.ts
import { createConnection } from 'typeorm';
import { Property } from '../src/properties/entities/property.entity';
import { Promoteur } from '../src/promoteurs/entities/promoteur.entity';
import { Project } from '../src/promoteurs/entities/project.entity';

async function createProjectsFromProperties() {
  const connection = await createConnection();
  
  try {
    console.log('🔄 Creating projects from existing properties...');
    
    const propertyRepository = connection.getRepository(Property);
    const promoteurRepository = connection.getRepository(Promoteur);
    const projectRepository = connection.getRepository(Project);
    
    const promoteurs = await promoteurRepository.find();
    
    for (const promoteur of promoteurs) {
      const properties = await propertyRepository.find({
        where: { promoteurId: promoteur.id },
      });
      
      // Group properties by location
      const locationGroups = properties.reduce((acc, property) => {
        const key = `${property.wilaya}-${property.daira}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(property);
        return acc;
      }, {} as Record<string, Property[]>);
      
      // Create projects for each location group
      for (const [locationKey, locationProperties] of Object.entries(locationGroups)) {
        if (locationProperties.length >= 3) { // Only create project if 3+ properties
          const firstProperty = locationProperties[0];
          
          const project = projectRepository.create({
            name: `Projet ${firstProperty.daira}`,
            slug: `${promoteur.slug}-${firstProperty.daira.toLowerCase().replace(/\s+/g, '-')}`,
            description: `Projet immobilier à ${firstProperty.daira}, ${firstProperty.wilaya}`,
            location: `${firstProperty.daira}, ${firstProperty.wilaya}`,
            wilaya: firstProperty.wilaya,
            daira: firstProperty.daira,
            status: 'construction',
            totalUnits: locationProperties.length,
            availableUnits: locationProperties.filter(p => p.transactionType === 'vendre').length,
            promoteur,
          });
          
          const savedProject = await projectRepository.save(project);
          
          // Link properties to project
          await propertyRepository.update(
            { id: In(locationProperties.map(p => p.id)) },
            { projectId: savedProject.id }
          );
          
          console.log(`✅ Created project: ${project.name} (${locationProperties.length} properties)`);
        }
      }
    }
    
    console.log('🎉 Project creation completed!');
    
  } catch (error) {
    console.error('❌ Project creation failed:', error);
  } finally {
    await connection.close();
  }
}

createProjectsFromProperties();
```

---

## 🔄 Database Entity Updates

### 1. Update Property Entity

```typescript
// src/properties/entities/property.entity.ts
import { ManyToOne } from 'typeorm';
import { Promoteur } from '../../promoteurs/entities/promoteur.entity';
import { Agence } from '../../promoteurs/entities/agence.entity';
import { Project } from '../../promoteurs/entities/project.entity';

@Entity('properties')
export class Property {
  // ... existing fields

  // New relationships (nullable for backward compatibility)
  @ManyToOne(() => Agence, (agence) => agence.properties, { nullable: true })
  agence?: Agence;

  @ManyToOne(() => Promoteur, (promoteur) => promoteur.properties, { nullable: true })
  promoteur?: Promoteur;

  @ManyToOne(() => Project, (project) => project.properties, { nullable: true })
  project?: Project;

  // ... rest of entity
}
```

### 2. Create New Entities

```typescript
// src/promoteurs/entities/promoteur.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Project } from './project.entity';
import { Property } from '../../properties/entities/property.entity';

@Entity('promoteurs')
@Index(['slug'], { unique: true })
@Index(['name'])
export class Promoteur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  wilaya: string;

  @Column({ nullable: true })
  daira: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Project, (project) => project.promoteur)
  projects: Project[];

  @OneToMany(() => Property, (property) => property.promoteur)
  properties: Property[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🚀 Migration Deployment Script

```bash
#!/bin/bash
# scripts/deploy-database-migration.sh

echo "🚀 Starting Database Migration Deployment"
echo "========================================"

# Step 1: Backup database
echo "📦 Creating database backup..."
mysqldump exped360_db > backup_before_db_migration_$(date +%Y%m%d_%H%M%S).sql

# Step 2: Run SQL migrations
echo "🗄️ Running SQL migrations..."
mysql exped360_db < migrations/001-create-promoteurs-agences-projects.sql
mysql exped360_db < migrations/002-add-property-relationships.sql
mysql exped360_db < migrations/003-migrate-existing-data.sql

# Step 3: Run Node.js migration scripts
echo "🔄 Running configuration migration..."
npm run ts-node scripts/migrate-config-to-db.ts

echo "🏗️ Creating projects from properties..."
npm run ts-node scripts/create-projects-from-properties.ts

# Step 4: Build and restart application
echo "🔨 Building application..."
npm run build

echo "🔄 Restarting application..."
pm2 restart exped360-backend

echo "✅ Database migration completed!"
```

---

## ⚠️ Important Notes

1. **Backup First**: Always create a database backup before running migrations
2. **Test Locally**: Run all migrations on a local copy first
3. **Gradual Rollout**: Consider running migrations during low-traffic periods
4. **Rollback Plan**: Have a rollback strategy ready
5. **Monitor**: Watch application logs after deployment

## 🔄 Rollback Strategy

If something goes wrong, you can rollback by:

1. **Restore Database**: `mysql exped360_db < backup_file.sql`
2. **Revert Code**: Switch back to the virtual system
3. **Restart Application**: `pm2 restart exped360-backend`

The virtual system will continue working with the original `propertyOwnerName` fields.

---

## 📊 Verification Queries

After migration, run these queries to verify:

```sql
-- Check promoteurs count
SELECT COUNT(*) as promoteurs_count FROM promoteurs;

-- Check agences count  
SELECT COUNT(*) as agences_count FROM agences;

-- Check linked properties
SELECT 
  COUNT(*) as total_properties,
  COUNT(promoteurId) as properties_with_promoteur,
  COUNT(agenceId) as properties_with_agence,
  COUNT(projectId) as properties_with_project
FROM properties;

-- Sample data verification
SELECT 
  p.title,
  p.propertyOwnerType,
  p.propertyOwnerName,
  pr.name as promoteur_name,
  a.name as agence_name,
  proj.name as project_name
FROM properties p
LEFT JOIN promoteurs pr ON p.promoteurId = pr.id
LEFT JOIN agences a ON p.agenceId = a.id
LEFT JOIN projects proj ON p.projectId = proj.id
WHERE p.propertyOwnerType IN ('Promotion immobilière', 'Agence immobilière')
LIMIT 10;
```

This completes the optional database migration phase. Remember, the virtual system (Phase 1-2) provides all necessary functionality, and this database migration is only needed for advanced features.
