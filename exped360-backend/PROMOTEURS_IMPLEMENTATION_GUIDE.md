# 🏗️ Promoteurs & Agences Implementation Guide

## 📋 Overview

This guide implements a system for Property Developers (Promoteurs) and Real Estate Agencies (Agences) with their projects and properties, using your existing `propertyOwnerType` and `propertyOwnerName` fields.

## 🎯 Implementation Strategy

We'll use a **3-phase approach** that ensures zero downtime and backward compatibility:

1. **Phase 1**: Virtual System (uses existing data)
2. **Phase 2**: Enhanced Features (configuration-based)
3. **Phase 3**: Database Migration (optional)

---

## 📁 Project Structure

```
src/
├── promoteurs/
│   ├── controllers/
│   │   ├── promoteurs.controller.ts
│   │   ├── agences.controller.ts
│   │   └── admin-promoteurs.controller.ts
│   ├── services/
│   │   ├── promoteurs.service.ts
│   │   ├── agences.service.ts
│   │   └── projects.service.ts
│   ├── dto/
│   │   ├── promoteur-config.dto.ts
│   │   └── agence-config.dto.ts
│   ├── interfaces/
│   │   └── promoteur.interface.ts
│   └── promoteurs.module.ts
├── config/
│   ├── promoteurs-config.json
│   └── agences-config.json
```

---

## 🚀 Phase 1: Virtual System Implementation

### Step 1: Create Interfaces

Create `src/promoteurs/interfaces/promoteur.interface.ts`:

```typescript
export interface IPromoteur {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  propertyCount: number;
  activeProjects: number;
  createdAt?: Date;
}

export interface IAgence {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  propertyCount: number;
  createdAt?: Date;
}

export interface IProject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  images?: string[];
  location?: string;
  wilaya?: string;
  daira?: string;
  status: 'planning' | 'construction' | 'completed';
  promoteurName: string;
  propertyCount: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface IPromoteurConfig {
  [key: string]: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
    wilaya?: string;
    daira?: string;
  };
}
```

### Step 2: Create Configuration Files

Create `src/config/promoteurs-config.json`:

```json
{
  "cevital-immobilier": {
    "name": "Cevital Immobilier",
    "description": "Leader du développement immobilier en Algérie",
    "logo": null,
    "website": "https://cevital.com",
    "phone": "+213 21 XX XX XX",
    "email": "contact@cevital.com",
    "address": "Zone industrielle, Béjaïa",
    "wilaya": "Béjaïa",
    "daira": "Béjaïa"
  }
}
```

Create `src/config/agences-config.json`:

```json
{
  "century-21-alger": {
    "name": "Century 21 Alger",
    "description": "Agence immobilière de référence à Alger",
    "logo": null,
    "website": "https://century21.dz",
    "phone": "+213 21 XX XX XX",
    "email": "contact@century21.dz",
    "address": "Rue Didouche Mourad, Alger",
    "wilaya": "Alger",
    "daira": "Alger Centre"
  }
}
```

### Step 3: Create Services

Create `src/promoteurs/services/promoteurs.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { IPromoteur, IProject, IPromoteurConfig } from '../interfaces/promoteur.interface';
import * as promoteursConfig from '../../config/promoteurs-config.json';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PromoteursService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async findAll(): Promise<IPromoteur[]> {
    // Get unique promoteurs from existing properties
    const promoteurData = await this.propertyRepository
      .createQueryBuilder('property')
      .select('DISTINCT property.propertyOwnerName', 'name')
      .addSelect('COUNT(*)', 'propertyCount')
      .addSelect('property.wilaya', 'wilaya')
      .where('property.propertyOwnerType = :type', { type: 'Promotion immobilière' })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .andWhere('property.propertyOwnerName != :empty', { empty: '' })
      .groupBy('property.propertyOwnerName')
      .addGroupBy('property.wilaya')
      .getRawMany();

    const config: IPromoteurConfig = promoteursConfig as any;
    
    const promoteursMap = new Map<string, IPromoteur>();

    for (const data of promoteurData) {
      const slug = this.generateSlug(data.name);
      const configData = config[slug] || {};

      if (promoteursMap.has(slug)) {
        // Aggregate property count
        const existing = promoteursMap.get(slug)!;
        existing.propertyCount += parseInt(data.propertyCount);
      } else {
        promoteursMap.set(slug, {
          id: slug,
          name: data.name,
          slug,
          description: configData.description || null,
          logo: configData.logo || null,
          website: configData.website || null,
          phone: configData.phone || null,
          email: configData.email || null,
          address: configData.address || null,
          wilaya: configData.wilaya || data.wilaya,
          daira: configData.daira || null,
          propertyCount: parseInt(data.propertyCount),
          activeProjects: 0, // Will be calculated
        });
      }
    }

    // Calculate active projects for each promoteur
    for (const promoteur of promoteursMap.values()) {
      const projects = await this.getPromoteurProjects(promoteur.name);
      promoteur.activeProjects = projects.length;
    }

    return Array.from(promoteursMap.values()).sort((a, b) => b.propertyCount - a.propertyCount);
  }

  async findBySlug(slug: string): Promise<IPromoteur | null> {
    const promoteurs = await this.findAll();
    return promoteurs.find(p => p.slug === slug) || null;
  }

  async getPromoteurProperties(promoteurName: string) {
    return this.propertyRepository.find({
      where: {
        propertyOwnerType: 'Promotion immobilière',
        propertyOwnerName: promoteurName,
      },
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPromoteurProjects(promoteurName: string): Promise<IProject[]> {
    const properties = await this.getPromoteurProperties(promoteurName);
    
    // Group properties by location to create virtual projects
    const projectsMap = new Map<string, IProject>();

    for (const property of properties) {
      const key = `${property.wilaya}-${property.daira}`;
      const slug = this.generateSlug(`${promoteurName} ${property.daira}`);

      if (projectsMap.has(key)) {
        const project = projectsMap.get(key)!;
        project.propertyCount++;
        
        // Update price range
        const price = parseFloat(property.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(price)) {
          project.minPrice = Math.min(project.minPrice || price, price);
          project.maxPrice = Math.max(project.maxPrice || price, price);
        }
      } else {
        const price = parseFloat(property.price.replace(/[^0-9.]/g, ''));
        
        projectsMap.set(key, {
          id: slug,
          name: `Projet ${property.daira}`,
          slug,
          description: `Projet immobilier à ${property.daira}, ${property.wilaya}`,
          location: `${property.daira}, ${property.wilaya}`,
          wilaya: property.wilaya,
          daira: property.daira,
          status: 'construction',
          promoteurName,
          propertyCount: 1,
          minPrice: !isNaN(price) ? price : undefined,
          maxPrice: !isNaN(price) ? price : undefined,
          coverImage: property.images?.[0]?.imageUrl || null,
        });
      }
    }

    return Array.from(projectsMap.values());
  }

  async updatePromoteurConfig(slug: string, configData: any): Promise<void> {
    const configPath = path.join(__dirname, '../../config/promoteurs-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    config[slug] = { ...config[slug], ...configData };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
```

Create `src/promoteurs/services/agences.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { IAgence, IPromoteurConfig } from '../interfaces/promoteur.interface';
import * as agencesConfig from '../../config/agences-config.json';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AgencesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async findAll(): Promise<IAgence[]> {
    // Get unique agences from existing properties
    const agenceData = await this.propertyRepository
      .createQueryBuilder('property')
      .select('DISTINCT property.propertyOwnerName', 'name')
      .addSelect('COUNT(*)', 'propertyCount')
      .addSelect('property.wilaya', 'wilaya')
      .where('property.propertyOwnerType = :type', { type: 'Agence immobilière' })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .andWhere('property.propertyOwnerName != :empty', { empty: '' })
      .groupBy('property.propertyOwnerName')
      .addGroupBy('property.wilaya')
      .getRawMany();

    const config: IPromoteurConfig = agencesConfig as any;
    
    const agencesMap = new Map<string, IAgence>();

    for (const data of agenceData) {
      const slug = this.generateSlug(data.name);
      const configData = config[slug] || {};

      if (agencesMap.has(slug)) {
        // Aggregate property count
        const existing = agencesMap.get(slug)!;
        existing.propertyCount += parseInt(data.propertyCount);
      } else {
        agencesMap.set(slug, {
          id: slug,
          name: data.name,
          slug,
          description: configData.description || null,
          logo: configData.logo || null,
          website: configData.website || null,
          phone: configData.phone || null,
          email: configData.email || null,
          address: configData.address || null,
          wilaya: configData.wilaya || data.wilaya,
          daira: configData.daira || null,
          propertyCount: parseInt(data.propertyCount),
        });
      }
    }

    return Array.from(agencesMap.values()).sort((a, b) => b.propertyCount - a.propertyCount);
  }

  async findBySlug(slug: string): Promise<IAgence | null> {
    const agences = await this.findAll();
    return agences.find(a => a.slug === slug) || null;
  }

  async getAgenceProperties(agenceName: string) {
    return this.propertyRepository.find({
      where: {
        propertyOwnerType: 'Agence immobilière',
        propertyOwnerName: agenceName,
      },
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateAgenceConfig(slug: string, configData: any): Promise<void> {
    const configPath = path.join(__dirname, '../../config/agences-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    config[slug] = { ...config[slug], ...configData };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
```

### Step 4: Create Controllers

Create `src/promoteurs/controllers/promoteurs.controller.ts`:

```typescript
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PromoteursService } from '../services/promoteurs.service';

@Controller('api/promoteurs')
export class PromoteursController {
  constructor(private readonly promoteursService: PromoteursService) {}

  @Get()
  async findAll() {
    return this.promoteursService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const promoteur = await this.promoteursService.findBySlug(slug);
    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }
    return promoteur;
  }

  @Get(':slug/projects')
  async getProjects(@Param('slug') slug: string) {
    const promoteur = await this.promoteursService.findBySlug(slug);
    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }
    return this.promoteursService.getPromoteurProjects(promoteur.name);
  }

  @Get(':slug/properties')
  async getProperties(@Param('slug') slug: string) {
    const promoteur = await this.promoteursService.findBySlug(slug);
    if (!promoteur) {
      throw new NotFoundException('Promoteur not found');
    }
    
    const properties = await this.promoteursService.getPromoteurProperties(promoteur.name);
    
    // Transform for frontend
    return properties.map(property => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      type: property.type,
      transactionType: property.transactionType,
      price: property.price,
      surface: property.surface,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      wilaya: property.wilaya,
      daira: property.daira,
      address: property.address,
      isFeatured: property.isFeatured,
      createdAt: property.createdAt,
      image: property.images?.[0]?.imageUrl || null,
    }));
  }
}
```

Create `src/promoteurs/controllers/agences.controller.ts`:

```typescript
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AgencesService } from '../services/agences.service';

@Controller('api/agences')
export class AgencesController {
  constructor(private readonly agencesService: AgencesService) {}

  @Get()
  async findAll() {
    return this.agencesService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const agence = await this.agencesService.findBySlug(slug);
    if (!agence) {
      throw new NotFoundException('Agence not found');
    }
    return agence;
  }

  @Get(':slug/properties')
  async getProperties(@Param('slug') slug: string) {
    const agence = await this.agencesService.findBySlug(slug);
    if (!agence) {
      throw new NotFoundException('Agence not found');
    }
    
    const properties = await this.agencesService.getAgenceProperties(agence.name);
    
    // Transform for frontend
    return properties.map(property => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      type: property.type,
      transactionType: property.transactionType,
      price: property.price,
      surface: property.surface,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      wilaya: property.wilaya,
      daira: property.daira,
      address: property.address,
      isFeatured: property.isFeatured,
      createdAt: property.createdAt,
      image: property.images?.[0]?.imageUrl || null,
    }));
  }
}
```

### Step 5: Create Module

Create `src/promoteurs/promoteurs.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../properties/entities/property.entity';
import { PromoteursService } from './services/promoteurs.service';
import { AgencesService } from './services/agences.service';
import { PromoteursController } from './controllers/promoteurs.controller';
import { AgencesController } from './controllers/agences.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
  ],
  controllers: [
    PromoteursController,
    AgencesController,
  ],
  providers: [
    PromoteursService,
    AgencesService,
  ],
  exports: [
    PromoteursService,
    AgencesService,
  ],
})
export class PromoteursModule {}
```

### Step 6: Update App Module

Add to `src/app.module.ts`:

```typescript
import { PromoteursModule } from './promoteurs/promoteurs.module';

@Module({
  imports: [
    // ... existing imports
    PromoteursModule,
  ],
  // ... rest of module
})
export class AppModule {}
```

---

## 🎯 Phase 2: Admin Interface (Optional)

### Create Admin Controller

Create `src/promoteurs/controllers/admin-promoteurs.controller.ts`:

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PromoteursService } from '../services/promoteurs.service';
import { AgencesService } from '../services/agences.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// Import your admin guard if you have one

@Controller('admin/promoteurs')
@UseGuards(JwtAuthGuard) // Add admin guard if available
export class AdminPromoteursController {
  constructor(
    private readonly promoteursService: PromoteursService,
    private readonly agencesService: AgencesService,
  ) {}

  @Get('promoteurs')
  async getPromoteurs() {
    return this.promoteursService.findAll();
  }

  @Get('agences')
  async getAgences() {
    return this.agencesService.findAll();
  }

  @Post('promoteurs/:slug/config')
  async updatePromoteurConfig(
    @Param('slug') slug: string,
    @Body() configData: any,
  ) {
    await this.promoteursService.updatePromoteurConfig(slug, configData);
    return { success: true };
  }

  @Post('agences/:slug/config')
  async updateAgenceConfig(
    @Param('slug') slug: string,
    @Body() configData: any,
  ) {
    await this.agencesService.updateAgenceConfig(slug, configData);
    return { success: true };
  }
}
```

---

## 🚀 Deployment Instructions

### 1. Build and Test

```bash
# Install dependencies (if any new ones)
npm install

# Build the application
npm run build

# Test the new endpoints
curl http://localhost:3000/api/promoteurs
curl http://localhost:3000/api/agences
```

### 2. Deploy to Production

```bash
# Create backup (recommended)
mysqldump exped360_db > backup_before_promoteurs.sql

# Deploy using your existing method
./deploy-vps.sh  # or your deployment script

# Or manually:
pm2 restart exped360-backend
```

### 3. Verification

Test these endpoints after deployment:
- `GET /api/promoteurs` - List all promoteurs
- `GET /api/promoteurs/{slug}` - Get promoteur details
- `GET /api/promoteurs/{slug}/projects` - Get promoteur projects
- `GET /api/promoteurs/{slug}/properties` - Get promoteur properties
- `GET /api/agences` - List all agences
- `GET /api/agences/{slug}` - Get agence details
- `GET /api/agences/{slug}/properties` - Get agence properties

---

## 📱 Frontend Integration Examples

### Next.js Pages

```typescript
// pages/promoteurs/index.tsx
export async function getStaticProps() {
  const res = await fetch(`${process.env.API_URL}/api/promoteurs`);
  const promoteurs = await res.json();
  
  return {
    props: { promoteurs },
    revalidate: 3600, // Revalidate every hour
  };
}

// pages/promoteurs/[slug].tsx
export async function getStaticPaths() {
  const res = await fetch(`${process.env.API_URL}/api/promoteurs`);
  const promoteurs = await res.json();
  
  const paths = promoteurs.map((promoteur) => ({
    params: { slug: promoteur.slug },
  }));
  
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${process.env.API_URL}/api/promoteurs/${params.slug}`);
  const promoteur = await res.json();
  
  const projectsRes = await fetch(`${process.env.API_URL}/api/promoteurs/${params.slug}/projects`);
  const projects = await projectsRes.json();
  
  return {
    props: { promoteur, projects },
    revalidate: 3600,
  };
}
```

---

## 🔧 Configuration Management

### Adding New Promoteur/Agence

1. **Automatic Detection**: When you add a property with a new `propertyOwnerName`, it will automatically appear in the API.

2. **Manual Configuration**: Add details to the config files:

```json
// promoteurs-config.json
{
  "new-promoteur-slug": {
    "name": "New Promoteur Name",
    "description": "Description here",
    "logo": "cloudinary_url_here",
    "website": "https://website.com",
    "phone": "+213 XX XX XX XX",
    "email": "contact@promoteur.com"
  }
}
```

3. **Via Admin API** (if implemented):

```bash
curl -X POST http://localhost:3000/admin/promoteurs/new-promoteur-slug/config \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "New description",
    "logo": "new_logo_url",
    "website": "https://newwebsite.com"
  }'
```

---

## 🎯 Benefits of This Approach

✅ **Zero Risk**: Uses existing data, no database changes
✅ **Immediate Results**: Working system in hours, not days
✅ **SEO Ready**: Clean URLs and structured data
✅ **Scalable**: Easy to add database layer later
✅ **Maintainable**: Simple configuration-based system
✅ **Backward Compatible**: Existing functionality unchanged

---

## 🚀 Next Steps

1. **Implement Phase 1** (Virtual System)
2. **Test thoroughly** with your existing data
3. **Add configuration** for key promoteurs/agences
4. **Deploy to production** safely
5. **Monitor and iterate** based on usage
6. **Consider Phase 3** (Database) if needed later

---

## 📞 Support

If you need help with implementation:
1. Test each step in development first
2. Use your existing deployment process
3. Monitor logs for any issues
4. Keep the backup handy for rollback if needed

This approach gives you a professional promoteurs/agences system while maintaining the safety and reliability of your live website.
