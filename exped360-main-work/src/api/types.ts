// Property Owner Types
export enum PropertyOwnerType {
  AGENCE = 'Agence immobilière',
  PROMOTEUR = 'Promotion immobilière'
}

export interface PropertyOwner {
  id: string;
  name: string;
  slug: string;
  ownerType: PropertyOwnerType;
  description?: string;
  imageUrl?: string;
  coverImage?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  properties?: Property[];
  projects?: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyOwnerDto {
  name: string;
  ownerType: PropertyOwnerType;
  description?: string;
  imageUrl?: string;
  coverImage?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
}

export interface UpdatePropertyOwnerDto extends Partial<CreatePropertyOwnerDto> {}

// Project Types
export enum ProjectStatus {
  PLANNING = 'planning',
  CONSTRUCTION = 'construction',
  COMPLETED = 'completed'
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  coverImage?: string;
  images?: string[];
  address?: string;
  wilaya?: string;
  daira?: string;
  latitude?: number;
  longitude?: number;
  startDate?: Date;
  expectedCompletionDate?: Date;
  status: ProjectStatus;
  totalUnits: number;
  availableUnits: number;
  propertyOwner: PropertyOwner;
  properties?: Property[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  imageUrl?: string;
  coverImage?: string;
  images?: string[];
  address?: string;
  wilaya?: string;
  daira?: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  expectedCompletionDate?: string;
  status?: ProjectStatus;
  totalUnits?: number;
  availableUnits?: number;
  propertyOwnerId: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

// Statistics Types
export interface PropertyOwnerStatistics {
  propertyOwner: PropertyOwner;
  stats: {
    totalProperties: number;
    totalProjects: number;
    activeProperties: number;
    featuredProperties: number;
  };
}

export interface ProjectStatistics {
  project: Project;
  stats: {
    totalProperties: number;
    availableProperties: number;
    soldProperties: number;
    completionPercentage: number;
  };
}

// Import Property type from existing API
export interface Property {
  id: string;
  title: string;
  description?: string;
  price: string;
  type: string;
  transactionType: string;
  bedrooms?: number;
  bathrooms?: number;
  surface: number;
  wilaya: string;
  daira: string;
  address: string;
  images?: string[];
  amenities?: string[];
  propertyOwnerType: string;
  propertyOwnerName?: string;
  propertyOwner?: PropertyOwner;
  project?: Project;
  createdAt: Date;
  updatedAt: Date;
}
