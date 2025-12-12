# 🏗️ Full Database System - Promoteurs & Agences Implementation

## 📋 Overview

This is the complete database-backed implementation of the Promoteurs (Property Developers) and Agences Immobilières (Real Estate Agencies) system with full entity relationships, admin interface, and migration scripts.

## 🎯 What's Included

### ✅ **Complete Database Schema**
- **Promoteurs Table**: Full company profiles with relationships
- **Agences Table**: Real estate agency management
- **Projects Table**: Project management with progress tracking
- **Property Relationships**: Foreign keys linking properties to entities

### ✅ **Full Admin Interface**
- Create, read, update, delete operations for all entities
- Property assignment management
- Bulk operations and statistics
- Advanced filtering and search

### ✅ **Public API Endpoints**
- SEO-friendly URLs for all entities
- Comprehensive data transformation
- Statistics and analytics
- Location-based search

### ✅ **Migration System**
- Safe database migrations
- Automatic data migration from existing properties
- Rollback capabilities
- Verification scripts

---

## 🗂️ File Structure

```
src/
├── promoteurs/
│   ├── entities/
│   │   ├── promoteur.entity.ts      # Promoteur database entity
│   │   ├── agence.entity.ts         # Agence database entity
│   │   └── project.entity.ts        # Project database entity
│   ├── dto/
│   │   ├── create-promoteur.dto.ts  # Validation for creating promoteurs
│   │   ├── create-agence.dto.ts     # Validation for creating agences
│   │   ├── create-project.dto.ts    # Validation for creating projects
│   │   └── update-*.dto.ts          # Update DTOs
│   ├── services/
│   │   ├── promoteurs.service.ts    # Business logic for promoteurs
│   │   ├── agences.service.ts       # Business logic for agences
│   │   ├── projects.service.ts      # Business logic for projects
│   │   └── property-assignment.service.ts # Property assignment logic
│   ├── controllers/
│   │   ├── admin-*.controller.ts    # Admin API endpoints
│   │   ├── public-*.controller.ts   # Public API endpoints
│   │   └── admin-property-assignment.controller.ts
│   └── promoteurs.module.ts         # Module configuration
├── auth/guards/
│   └── admin.guard.ts               # Admin authentication guard
migrations/
├── 001-create-promoteurs-agences-projects.sql
├── 002-add-property-relationships.sql
└── 003-migrate-existing-data.sql
```

---

## 🚀 Deployment Instructions

### Prerequisites

1. **Database Backup**: Always create a backup before deployment
2. **Node.js**: Ensure compatible version (check package.json)
3. **MySQL**: Database access with admin privileges
4. **PM2**: Process manager (recommended)

### Quick Deployment

```bash
# Make script executable
chmod +x deploy-full-promoteurs-system.sh

# Run deployment
./deploy-full-promoteurs-system.sh
```

### Manual Deployment

```bash
# 1. Create backup
mysqldump exped360_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Install dependencies
npm install

# 3. Build application
npm run build

# 4. Run migrations
mysql exped360_db < migrations/001-create-promoteurs-agences-projects.sql
mysql exped360_db < migrations/002-add-property-relationships.sql
mysql exped360_db < migrations/003-migrate-existing-data.sql

# 5. Restart application
pm2 restart exped360-backend
```

---

## 📊 Database Schema

### Promoteurs Table

```sql
CREATE TABLE promoteurs (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo VARCHAR(500),
  website VARCHAR(500),
  phone VARCHAR(50),
  email VARCHAR(255),
  address VARCHAR(500),
  wilaya VARCHAR(100),
  daira VARCHAR(100),
  socialMedia TEXT,           -- JSON string
  certifications TEXT,        -- JSON string
  foundedYear INT DEFAULT 0,
  employeeCount INT DEFAULT 0,
  totalInvestment DECIMAL(15,2),
  isActive BOOLEAN DEFAULT TRUE,
  isFeatured BOOLEAN DEFAULT FALSE,
  viewCount INT DEFAULT 0,
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
```

### Agences Table

```sql
CREATE TABLE agences (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  logo VARCHAR(500),
  website VARCHAR(500),
  phone VARCHAR(50),
  email VARCHAR(255),
  address VARCHAR(500),
  wilaya VARCHAR(100),
  daira VARCHAR(100),
  socialMedia TEXT,           -- JSON string
  licenseNumber VARCHAR(100),
  licenseExpiry DATE,
  foundedYear INT DEFAULT 0,
  agentCount INT DEFAULT 0,
  specializations TEXT,       -- JSON string
  serviceAreas TEXT,          -- JSON string
  isActive BOOLEAN DEFAULT TRUE,
  isFeatured BOOLEAN DEFAULT FALSE,
  viewCount INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviewCount INT DEFAULT 0,
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
```

### Projects Table

```sql
CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  coverImage VARCHAR(500),
  images TEXT,                -- JSON array
  location VARCHAR(255),
  wilaya VARCHAR(100),
  daira VARCHAR(100),
  latitude FLOAT,
  longitude FLOAT,
  startDate DATE,
  expectedCompletionDate DATE,
  actualCompletionDate DATE,
  status ENUM('planning','construction','completed','on_hold','cancelled') DEFAULT 'planning',
  projectType ENUM('residential','commercial','mixed','industrial') DEFAULT 'residential',
  totalUnits INT DEFAULT 0,
  availableUnits INT DEFAULT 0,
  soldUnits INT DEFAULT 0,
  minPrice DECIMAL(15,2),
  maxPrice DECIMAL(15,2),
  totalBudget DECIMAL(15,2),
  completionPercentage DECIMAL(5,2) DEFAULT 0,
  amenities TEXT,             -- JSON array
  features TEXT,              -- JSON array
  nearbyPlaces TEXT,          -- JSON array
  paymentPlans TEXT,          -- JSON array
  isActive BOOLEAN DEFAULT TRUE,
  isFeatured BOOLEAN DEFAULT FALSE,
  viewCount INT DEFAULT 0,
  promoteurId VARCHAR(36),
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (promoteurId) REFERENCES promoteurs(id) ON DELETE SET NULL
);
```

### Property Relationships

```sql
-- Added to existing properties table
ALTER TABLE properties ADD COLUMN agenceId VARCHAR(36);
ALTER TABLE properties ADD COLUMN promoteurId VARCHAR(36);
ALTER TABLE properties ADD COLUMN projectId VARCHAR(36);

-- Foreign key constraints
ALTER TABLE properties ADD CONSTRAINT FK_properties_agence 
  FOREIGN KEY (agenceId) REFERENCES agences(id) ON DELETE SET NULL;
ALTER TABLE properties ADD CONSTRAINT FK_properties_promoteur 
  FOREIGN KEY (promoteurId) REFERENCES promoteurs(id) ON DELETE SET NULL;
ALTER TABLE properties ADD CONSTRAINT FK_properties_project 
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE SET NULL;
```

---

## 🔌 API Endpoints

### Public Endpoints (No Authentication Required)

#### Promoteurs
```bash
GET  /api/promoteurs                    # List all promoteurs
GET  /api/promoteurs/featured           # Featured promoteurs
GET  /api/promoteurs/popular            # Popular promoteurs
GET  /api/promoteurs/{slug}             # Promoteur details
GET  /api/promoteurs/{slug}/projects    # Promoteur projects
GET  /api/promoteurs/{slug}/properties  # Promoteur properties
GET  /api/promoteurs/search/location?wilaya=Alger&daira=Centre
```

#### Agences
```bash
GET  /api/agences                       # List all agences
GET  /api/agences/featured              # Featured agences
GET  /api/agences/top-rated             # Top rated agences
GET  /api/agences/{slug}                # Agence details
GET  /api/agences/{slug}/properties     # Agence properties
GET  /api/agences/search/location?wilaya=Alger&daira=Centre
```

#### Projects
```bash
GET  /api/projects                      # List all projects
GET  /api/projects/featured             # Featured projects
GET  /api/projects/by-status/{status}   # Projects by status
GET  /api/projects/{slug}               # Project details
GET  /api/projects/{slug}/properties    # Project properties
GET  /api/projects/search/location?wilaya=Alger&daira=Centre
```

### Admin Endpoints (Authentication Required)

#### Promoteurs Management
```bash
POST   /admin/promoteurs                # Create promoteur
GET    /admin/promoteurs                # List promoteurs (admin view)
GET    /admin/promoteurs/statistics     # Promoteur statistics
GET    /admin/promoteurs/{id}           # Get promoteur
GET    /admin/promoteurs/{id}/stats     # Promoteur stats
PATCH  /admin/promoteurs/{id}           # Update promoteur
DELETE /admin/promoteurs/{id}           # Delete promoteur
```

#### Agences Management
```bash
POST   /admin/agences                   # Create agence
GET    /admin/agences                   # List agences (admin view)
GET    /admin/agences/statistics        # Agence statistics
GET    /admin/agences/{id}              # Get agence
GET    /admin/agences/{id}/stats        # Agence stats
PATCH  /admin/agences/{id}              # Update agence
PATCH  /admin/agences/{id}/rating       # Update rating
DELETE /admin/agences/{id}              # Delete agence
```

#### Projects Management
```bash
POST   /admin/projects                  # Create project
GET    /admin/projects                  # List projects (admin view)
GET    /admin/projects/statistics       # Project statistics
GET    /admin/projects/{id}             # Get project
GET    /admin/projects/{id}/stats       # Project stats
PATCH  /admin/projects/{id}             # Update project
PATCH  /admin/projects/{id}/progress    # Update progress
DELETE /admin/projects/{id}             # Delete project
```

#### Property Assignment
```bash
POST /admin/properties/{id}/assign-to-agence      # Assign to agence
POST /admin/properties/{id}/assign-to-promoteur   # Assign to promoteur
POST /admin/properties/{id}/remove-assignments    # Remove assignments
POST /admin/properties/bulk-auto-assign           # Bulk auto-assign
GET  /admin/properties/assignment-stats           # Assignment statistics
GET  /admin/properties/unassigned                 # Unassigned properties
```

---

## 📝 Usage Examples

### Creating a Promoteur

```bash
curl -X POST http://localhost:3000/admin/promoteurs \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cevital Immobilier",
    "description": "Leading real estate developer in Algeria",
    "website": "https://cevital.com",
    "phone": "+213 21 XX XX XX",
    "email": "contact@cevital.com",
    "address": "Zone industrielle, Béjaïa",
    "wilaya": "Béjaïa",
    "foundedYear": 1998,
    "employeeCount": 150,
    "isFeatured": true
  }'
```

### Creating a Project

```bash
curl -X POST http://localhost:3000/admin/projects \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Les Jardins de Sidi Abdellah",
    "description": "Modern residential complex with all amenities",
    "location": "Sidi Abdellah, Alger",
    "wilaya": "Alger",
    "daira": "Sidi Abdellah",
    "status": "construction",
    "projectType": "residential",
    "totalUnits": 120,
    "availableUnits": 85,
    "minPrice": 15000000,
    "maxPrice": 35000000,
    "startDate": "2024-01-01",
    "expectedCompletionDate": "2025-12-31",
    "promoteurId": "promoteur-uuid-here"
  }'
```

### Assigning Property to Promoteur

```bash
curl -X POST http://localhost:3000/admin/properties/{property-id}/assign-to-promoteur \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "promoteurId": "promoteur-uuid-here",
    "projectId": "project-uuid-here"
  }'
```

### Bulk Auto-Assignment

```bash
curl -X POST http://localhost:3000/admin/properties/bulk-auto-assign \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔍 Verification Queries

After deployment, run these queries to verify the system:

```sql
-- Check entity counts
SELECT 'Promoteurs' as entity, COUNT(*) as count FROM promoteurs
UNION ALL
SELECT 'Agences' as entity, COUNT(*) as count FROM agences
UNION ALL
SELECT 'Projects' as entity, COUNT(*) as count FROM projects;

-- Check property assignments
SELECT 
  COUNT(*) as total_properties,
  COUNT(promoteurId) as assigned_to_promoteurs,
  COUNT(agenceId) as assigned_to_agences,
  COUNT(projectId) as assigned_to_projects
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

---

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based authentication for admin endpoints
- Role-based access control (Admin only)
- Input validation and sanitization
- SQL injection prevention

### Data Protection
- Soft deletes (isActive flag)
- Foreign key constraints
- Transaction safety
- Backup verification

---

## 📊 Analytics & Statistics

### Available Statistics

#### Promoteur Stats
- Total projects and properties
- Completion rates
- Investment amounts
- View counts

#### Agence Stats
- Property counts by type
- Rating and reviews
- Recent activity
- Performance metrics

#### Project Stats
- Completion percentage
- Unit availability
- Price ranges
- Timeline tracking

#### System Stats
- Overall entity counts
- Assignment rates
- Popular locations
- Growth metrics

---

## 🔧 Maintenance

### Regular Tasks

1. **Monitor Assignment Rates**
   ```bash
   curl http://localhost:3000/admin/properties/assignment-stats \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
   ```

2. **Update Project Progress**
   ```bash
   curl -X PATCH http://localhost:3000/admin/projects/{id}/progress \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -d '{"completionPercentage": 75}'
   ```

3. **Backup Database Regularly**
   ```bash
   mysqldump exped360_db > backup_$(date +%Y%m%d).sql
   ```

### Performance Optimization

- Database indexes on frequently queried columns
- Pagination for large datasets
- Caching for popular endpoints
- Query optimization for statistics

---

## 🚨 Troubleshooting

### Common Issues

1. **Migration Fails**
   - Check database permissions
   - Verify MySQL version compatibility
   - Restore from backup and retry

2. **Foreign Key Errors**
   - Ensure proper entity relationships
   - Check for orphaned records
   - Verify constraint definitions

3. **Authentication Issues**
   - Verify JWT token validity
   - Check user roles and permissions
   - Ensure admin guard is properly configured

4. **Performance Issues**
   - Monitor database query performance
   - Check for missing indexes
   - Optimize N+1 query problems

### Rollback Procedure

```bash
# 1. Stop application
pm2 stop exped360-backend

# 2. Restore database
mysql exped360_db < backup_file.sql

# 3. Revert code changes
git checkout previous-commit

# 4. Rebuild and restart
npm run build
pm2 start exped360-backend
```

---

## 🎯 Success Metrics

After successful deployment:

✅ **Database**: All tables created with proper relationships  
✅ **Data Migration**: Existing properties linked to entities  
✅ **API Endpoints**: All endpoints responding correctly  
✅ **Admin Interface**: Full CRUD operations working  
✅ **Public API**: SEO-friendly URLs accessible  
✅ **Statistics**: Analytics and reporting functional  
✅ **Security**: Authentication and authorization active  
✅ **Performance**: Response times within acceptable limits  

---

## 📞 Support

For issues or questions:

1. Check application logs: `pm2 logs exped360-backend`
2. Verify database connectivity
3. Test API endpoints manually
4. Review migration scripts
5. Check authentication configuration

This comprehensive system provides a professional, scalable solution for managing promoteurs, agences, and projects with full database relationships and admin capabilities.
