# 🧩 Code Templates & Examples

## 📋 Quick Implementation Templates

### 1. Basic Service Template

```typescript
// src/promoteurs/services/base.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Injectable()
export abstract class BasePromoteurService {
  constructor(
    @InjectRepository(Property)
    protected propertyRepository: Repository<Property>,
  ) {}

  protected generateSlug(name: string): string {
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

  protected async getPropertiesByOwner(ownerType: string, ownerName?: string) {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .where('property.propertyOwnerType = :type', { type: ownerType });

    if (ownerName) {
      query.andWhere('property.propertyOwnerName = :name', { name: ownerName });
    }

    return query
      .leftJoinAndSelect('property.images', 'images')
      .orderBy('property.createdAt', 'DESC')
      .getMany();
  }
}
```

### 2. Controller Template

```typescript
// src/promoteurs/controllers/base.controller.ts
import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';

export abstract class BaseController<T> {
  constructor(protected readonly service: any) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const entity = await this.service.findBySlug(slug);
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    return entity;
  }

  @Get(':slug/properties')
  async getProperties(@Param('slug') slug: string) {
    const entity = await this.service.findBySlug(slug);
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    return this.service.getProperties(entity.name);
  }

  protected abstract getEntityName(): string;
}
```

### 3. Configuration Manager

```typescript
// src/promoteurs/services/config-manager.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigManagerService {
  private getConfigPath(type: 'promoteurs' | 'agences'): string {
    return path.join(__dirname, `../../config/${type}-config.json`);
  }

  getConfig(type: 'promoteurs' | 'agences'): any {
    try {
      const configPath = this.getConfigPath(type);
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
      return {};
    } catch (error) {
      console.error(`Error reading ${type} config:`, error);
      return {};
    }
  }

  updateConfig(type: 'promoteurs' | 'agences', slug: string, data: any): void {
    try {
      const configPath = this.getConfigPath(type);
      const config = this.getConfig(type);
      
      config[slug] = { ...config[slug], ...data };
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error(`Error updating ${type} config:`, error);
      throw new Error(`Failed to update ${type} configuration`);
    }
  }

  deleteConfig(type: 'promoteurs' | 'agences', slug: string): void {
    try {
      const configPath = this.getConfigPath(type);
      const config = this.getConfig(type);
      
      delete config[slug];
      
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error(`Error deleting ${type} config:`, error);
      throw new Error(`Failed to delete ${type} configuration`);
    }
  }
}
```

### 4. Statistics Service

```typescript
// src/promoteurs/services/statistics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async getPromoteurStats(promoteurName: string) {
    const properties = await this.propertyRepository.find({
      where: {
        propertyOwnerType: 'Promotion immobilière',
        propertyOwnerName: promoteurName,
      },
    });

    const stats = {
      totalProperties: properties.length,
      saleProperties: properties.filter(p => p.transactionType === 'vendre').length,
      rentProperties: properties.filter(p => p.transactionType === 'location').length,
      averagePrice: 0,
      priceRange: { min: 0, max: 0 },
      locationDistribution: {},
      typeDistribution: {},
    };

    if (properties.length > 0) {
      const prices = properties
        .map(p => parseFloat(p.price.replace(/[^0-9.]/g, '')))
        .filter(p => !isNaN(p));

      if (prices.length > 0) {
        stats.averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        stats.priceRange.min = Math.min(...prices);
        stats.priceRange.max = Math.max(...prices);
      }

      // Location distribution
      stats.locationDistribution = properties.reduce((acc, prop) => {
        const key = `${prop.wilaya} - ${prop.daira}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      // Type distribution
      stats.typeDistribution = properties.reduce((acc, prop) => {
        acc[prop.type] = (acc[prop.type] || 0) + 1;
        return acc;
      }, {});
    }

    return stats;
  }

  async getAgenceStats(agenceName: string) {
    const properties = await this.propertyRepository.find({
      where: {
        propertyOwnerType: 'Agence immobilière',
        propertyOwnerName: agenceName,
      },
    });

    return {
      totalProperties: properties.length,
      saleProperties: properties.filter(p => p.transactionType === 'vendre').length,
      rentProperties: properties.filter(p => p.transactionType === 'location').length,
      featuredProperties: properties.filter(p => p.isFeatured).length,
      recentProperties: properties.filter(p => {
        const daysDiff = (Date.now() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      }).length,
    };
  }

  async getOverallStats() {
    const [promoteurCount, agenceCount, totalProperties] = await Promise.all([
      this.propertyRepository
        .createQueryBuilder('property')
        .select('COUNT(DISTINCT property.propertyOwnerName)', 'count')
        .where('property.propertyOwnerType = :type', { type: 'Promotion immobilière' })
        .andWhere('property.propertyOwnerName IS NOT NULL')
        .getRawOne(),
      
      this.propertyRepository
        .createQueryBuilder('property')
        .select('COUNT(DISTINCT property.propertyOwnerName)', 'count')
        .where('property.propertyOwnerType = :type', { type: 'Agence immobilière' })
        .andWhere('property.propertyOwnerName IS NOT NULL')
        .getRawOne(),
      
      this.propertyRepository.count(),
    ]);

    return {
      totalPromoteurs: parseInt(promoteurCount.count),
      totalAgences: parseInt(agenceCount.count),
      totalProperties,
      professionalProperties: await this.propertyRepository.count({
        where: [
          { propertyOwnerType: 'Promotion immobilière' },
          { propertyOwnerType: 'Agence immobilière' },
        ],
      }),
    };
  }
}
```

### 5. Search & Filter Service

```typescript
// src/promoteurs/services/search.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

export interface SearchFilters {
  wilaya?: string;
  daira?: string;
  minProperties?: number;
  maxProperties?: number;
  hasWebsite?: boolean;
  hasLogo?: boolean;
  search?: string;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async searchPromoteurs(filters: SearchFilters = {}) {
    let query = this.propertyRepository
      .createQueryBuilder('property')
      .select('property.propertyOwnerName', 'name')
      .addSelect('COUNT(*)', 'propertyCount')
      .addSelect('property.wilaya', 'wilaya')
      .where('property.propertyOwnerType = :type', { type: 'Promotion immobilière' })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .groupBy('property.propertyOwnerName')
      .addGroupBy('property.wilaya');

    if (filters.wilaya) {
      query = query.andWhere('property.wilaya = :wilaya', { wilaya: filters.wilaya });
    }

    if (filters.daira) {
      query = query.andWhere('property.daira = :daira', { daira: filters.daira });
    }

    if (filters.search) {
      query = query.andWhere('property.propertyOwnerName LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    const results = await query.getRawMany();

    // Apply post-query filters
    let filteredResults = results;

    if (filters.minProperties) {
      filteredResults = filteredResults.filter(
        r => parseInt(r.propertyCount) >= filters.minProperties!
      );
    }

    if (filters.maxProperties) {
      filteredResults = filteredResults.filter(
        r => parseInt(r.propertyCount) <= filters.maxProperties!
      );
    }

    return filteredResults;
  }

  async getPopularLocations(type: 'promoteurs' | 'agences') {
    const ownerType = type === 'promoteurs' ? 'Promotion immobilière' : 'Agence immobilière';
    
    return this.propertyRepository
      .createQueryBuilder('property')
      .select('property.wilaya', 'wilaya')
      .addSelect('property.daira', 'daira')
      .addSelect('COUNT(DISTINCT property.propertyOwnerName)', 'entityCount')
      .addSelect('COUNT(*)', 'propertyCount')
      .where('property.propertyOwnerType = :type', { type: ownerType })
      .andWhere('property.propertyOwnerName IS NOT NULL')
      .groupBy('property.wilaya')
      .addGroupBy('property.daira')
      .orderBy('entityCount', 'DESC')
      .addOrderBy('propertyCount', 'DESC')
      .getRawMany();
  }
}
```

### 6. Frontend Integration Helpers

```typescript
// utils/api.ts
export class PromoteursAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async getPromoteurs(filters?: any) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/api/promoteurs?${params}`);
    return response.json();
  }

  async getPromoteur(slug: string) {
    const response = await fetch(`${this.baseURL}/api/promoteurs/${slug}`);
    if (!response.ok) throw new Error('Promoteur not found');
    return response.json();
  }

  async getPromoteurProjects(slug: string) {
    const response = await fetch(`${this.baseURL}/api/promoteurs/${slug}/projects`);
    return response.json();
  }

  async getPromoteurProperties(slug: string) {
    const response = await fetch(`${this.baseURL}/api/promoteurs/${slug}/properties`);
    return response.json();
  }

  async getAgences(filters?: any) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/api/agences?${params}`);
    return response.json();
  }

  async getAgence(slug: string) {
    const response = await fetch(`${this.baseURL}/api/agences/${slug}`);
    if (!response.ok) throw new Error('Agence not found');
    return response.json();
  }

  async getAgenceProperties(slug: string) {
    const response = await fetch(`${this.baseURL}/api/agences/${slug}/properties`);
    return response.json();
  }
}

// React Hook Example
import { useState, useEffect } from 'react';

export function usePromoteurs() {
  const [promoteurs, setPromoteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const api = new PromoteursAPI(process.env.NEXT_PUBLIC_API_URL);
    
    api.getPromoteurs()
      .then(setPromoteurs)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { promoteurs, loading, error };
}
```

### 7. Admin Interface Components

```typescript
// Admin Form Component Example
import { useState } from 'react';

interface PromoteurConfigFormProps {
  slug: string;
  initialData?: any;
  onSave: (data: any) => void;
}

export function PromoteurConfigForm({ slug, initialData, onSave }: PromoteurConfigFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    logo: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    wilaya: '',
    daira: '',
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/admin/promoteurs/${slug}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave(formData);
        alert('Configuration saved successfully!');
      } else {
        alert('Error saving configuration');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving configuration');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Save Configuration
      </button>
    </form>
  );
}
```

### 8. Testing Templates

```typescript
// src/promoteurs/promoteurs.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoteursService } from './services/promoteurs.service';
import { Property } from '../properties/entities/property.entity';

describe('PromoteursService', () => {
  let service: PromoteursService;
  let repository: Repository<Property>;

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          name: 'Test Promoteur',
          propertyCount: '5',
          wilaya: 'Alger',
        },
      ]),
    })),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoteursService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PromoteursService>(PromoteursService);
    repository = module.get<Repository<Property>>(getRepositoryToken(Property));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return promoteurs list', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Promoteur');
    expect(result[0].propertyCount).toBe(5);
  });
});
```

These templates provide a solid foundation for implementing the promoteurs/agences system with proper structure, error handling, and extensibility.
