# Property Owner & Project Management Workflow

## 🎯 Complete Admin Workflow: Create Owner → Project → Properties

### Step 1: Create Property Owner (Agence or Promoteur)

#### Admin Interface Flow:
1. **Navigate to Admin Panel** → Property Owners → Create New
2. **Fill Owner Details:**
   ```json
   {
     "name": "Cevital Immobilier",
     "ownerType": "Promotion immobilière", // or "Agence immobilière"
     "description": "Leading real estate developer in Algeria...",
     "phoneNumber": "+213 21 XX XX XX",
     "email": "info@cevital-immo.dz",
     "website": "https://cevital-immo.dz",
     "address": "Zone industrielle, Bejaia",
     "wilaya": "Bejaia",
     "daira": "Bejaia"
   }
   ```
3. **Upload Logo/Cover Image** (Cloudinary integration)
4. **System Auto-generates:** 
   - UUID for ID
   - SEO-friendly slug: `cevital-immobilier`
5. **Save** → Owner profile created

#### API Endpoint:
```
POST /admin/property-owners
Authorization: Bearer {admin_jwt_token}
```

---

### Step 2: Create Project (For Promoteurs Only)

#### Admin Interface Flow:
1. **Navigate to** Property Owners → Select Promoteur → Projects → Create New
2. **Fill Project Details:**
   ```json
   {
     "name": "Les Jardins de Sidi Abdellah",
     "description": "Modern residential complex with all amenities...",
     "address": "Sidi Abdellah, Alger",
     "wilaya": "Alger",
     "daira": "Sidi Abdellah",
     "startDate": "2024-01-01",
     "expectedCompletionDate": "2025-12-31",
     "status": "construction", // planning, construction, completed
     "totalUnits": 120,
     "availableUnits": 120,
     "propertyOwnerId": "uuid-of-cevital"
   }
   ```
3. **Upload Project Images** (Cover + Gallery)
4. **System Auto-generates:**
   - UUID for ID
   - SEO-friendly slug: `les-jardins-de-sidi-abdellah`
5. **Save** → Project created under Promoteur

#### API Endpoint:
```
POST /admin/projects
Authorization: Bearer {admin_jwt_token}
```

---

### Step 3: Create Properties (Assign to Owner/Project)

#### Method A: Create Property with Owner Assignment

**Admin Interface Flow:**
1. **Navigate to** Properties → Create New Property
2. **Fill Property Details** (existing form)
3. **Owner Assignment Section:**
   - Select Owner Type: `Agence immobilière` or `Promotion immobilière`
   - **Search/Select Owner:** Dropdown with existing owners
   - **If Promoteur:** Optional project selection dropdown
4. **System Auto-assigns:**
   ```json
   {
     "propertyOwnerId": "uuid-of-selected-owner",
     "projectId": "uuid-of-selected-project" // if applicable
   }
   ```

#### Method B: Bulk Property Assignment

**Admin Interface Flow:**
1. **Navigate to** Property Owners → Select Owner → Properties → Assign Existing
2. **Multi-select Properties** from unassigned list
3. **Bulk Assign** to owner/project
4. **System Updates** all selected properties

---

## 🔄 Complete API Workflow

### 1. Create Agence Example:
```bash
curl -X POST /admin/property-owners \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Century 21 Alger",
    "ownerType": "Agence immobilière",
    "description": "Leading real estate agency in Algiers",
    "phoneNumber": "+213 21 XX XX XX",
    "email": "contact@century21.dz",
    "imageUrl": "cloudinary_logo_url"
  }'
```

### 2. Create Promoteur Example:
```bash
curl -X POST /admin/property-owners \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cevital Immobilier", 
    "ownerType": "Promotion immobilière",
    "description": "Premier promoteur immobilier en Algérie",
    "phoneNumber": "+213 21 XX XX XX",
    "email": "info@cevital-immo.dz",
    "website": "https://cevital-immo.dz"
  }'
```

### 3. Create Project for Promoteur:
```bash
curl -X POST /admin/projects \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Les Jardins de Sidi Abdellah",
    "description": "Résidence moderne avec toutes commodités",
    "wilaya": "Alger",
    "daira": "Sidi Abdellah", 
    "status": "construction",
    "propertyOwnerId": "uuid-of-cevital"
  }'
```

### 4. Create Property with Assignment:
```bash
curl -X POST /admin/properties \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Appartement F3 - Les Jardins",
    "price": "15000000",
    "type": "apartment",
    "transactionType": "vendre",
    "wilaya": "Alger",
    "daira": "Sidi Abdellah",
    "propertyOwnerId": "uuid-of-cevital",
    "projectId": "uuid-of-project"
  }'
```

---

## 🎨 Frontend Admin Interface Components

### PropertyOwnerForm Component:
```typescript
interface PropertyOwnerFormData {
  name: string;
  ownerType: 'Agence immobilière' | 'Promotion immobilière';
  description?: string;
  logo?: File;
  coverImage?: File;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
}

const PropertyOwnerForm = () => {
  const [formData, setFormData] = useState<PropertyOwnerFormData>();
  const [logoFile, setLogoFile] = useState<File>();
  
  const handleSubmit = async () => {
    // 1. Upload images to Cloudinary
    const logoUrl = logoFile ? await uploadToCloudinary(logoFile) : '';
    
    // 2. Create property owner
    await createPropertyOwner({
      ...formData,
      imageUrl: logoUrl
    });
  };
};
```

### ProjectForm Component:
```typescript
const ProjectForm = ({ propertyOwnerId }: { propertyOwnerId: string }) => {
  const [formData, setFormData] = useState<CreateProjectDto>();
  const [images, setImages] = useState<File[]>([]);
  
  const handleSubmit = async () => {
    // Upload project images
    const imageUrls = await Promise.all(
      images.map(img => uploadToCloudinary(img))
    );
    
    // Create project
    await createProject({
      ...formData,
      propertyOwnerId,
      images: imageUrls
    });
  };
};
```

### Enhanced PropertyForm Component:
```typescript
const PropertyForm = () => {
  const [owners] = usePropertyOwners();
  const [projects] = useProjects();
  const [selectedOwner, setSelectedOwner] = useState<PropertyOwner>();
  
  return (
    <form>
      {/* Existing property fields */}
      
      {/* New Owner Assignment Section */}
      <Select 
        placeholder="Select Property Owner"
        onChange={(ownerId) => {
          const owner = owners.find(o => o.id === ownerId);
          setSelectedOwner(owner);
        }}
      >
        {owners.map(owner => (
          <option key={owner.id} value={owner.id}>
            {owner.name} ({owner.ownerType})
          </option>
        ))}
      </Select>
      
      {/* Project Selection (only for promoteurs) */}
      {selectedOwner?.ownerType === 'Promotion immobilière' && (
        <Select placeholder="Select Project (Optional)">
          {projects
            .filter(p => p.propertyOwnerId === selectedOwner.id)
            .map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
        </Select>
      )}
    </form>
  );
};
```

---

## 🚀 Migration & Deployment Strategy

### Phase 1: Database Setup (Zero Downtime)
```bash
# Run migrations in sequence
mysql -u user -p database < migrations/001-create-property-owners-table.sql
mysql -u user -p database < migrations/002-create-projects-table.sql  
mysql -u user -p database < migrations/003-add-property-relationships.sql
mysql -u user -p database < migrations/004-migrate-existing-data.sql
```

### Phase 2: Backend Deployment
```bash
# Deploy new backend with entities
npm run build
pm2 restart exped360-backend
```

### Phase 3: Admin Interface Update
```bash
# Deploy admin interface with new forms
npm run build:admin
# Update admin routes
```

### Phase 4: Public Pages (Future)
- `/agences` - List all agences
- `/agences/[slug]` - Agence profile page
- `/promoteurs` - List all promoteurs  
- `/promoteurs/[slug]` - Promoteur profile page
- `/projets/[slug]` - Project detail page

---

## ✅ Benefits of This Approach

### 🔒 **Admin Control**
- No external access needed
- Full control over content
- Professional presentation

### 📊 **Rich Data Structure**
- Proper relationships between entities
- SEO-friendly URLs
- Comprehensive property organization

### 🚀 **Scalable Architecture**
- Easy to add more owners/projects
- Backward compatible with existing data
- Future-ready for advanced features

### 💼 **Business Value**
- Professional property owner profiles
- Project-based property grouping
- Enhanced property discovery
- Better lead generation

---

## 🎯 Next Steps

1. **Run Migrations** on staging environment
2. **Test Admin Interface** with sample data
3. **Deploy to Production** during low-traffic period
4. **Create Initial Property Owners** from existing data
5. **Organize Properties** into projects/owners
6. **Launch Public Pages** for enhanced user experience

This workflow ensures a smooth transition from your current system to the enhanced property owner and project management system while maintaining full backward compatibility.
