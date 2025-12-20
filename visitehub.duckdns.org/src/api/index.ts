import { API_CONFIG, createApiConfig } from './config';
import { ENDPOINTS } from './endpoints';
import { BlogPost, CreateBlogPostDto, UpdateBlogPostDto, BlogAnalytics, BlogPostStatus } from '@/lib/blogTypes';

export interface NearbyPlace {
  id: string;
  name: string;
  distance: string;
  icon: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  transactionType: 'vendre' | 'location';
  bedrooms: number;
  etage?: number;
  surface: number;
  wilaya: string;
  daira: string;
  address: string;
  images: string[];
  amenities: string[];
  nearbyPlaces?: NearbyPlace[];
  papers?: string[];
  iframe360Link?: string;
  phoneNumber?: string;
  apartmentType?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  viewCount: number;
  slug?: string;
  isFeatured?: boolean;
  rentPeriod?: 'month' | 'day';
  propertyOwnerType?: string; // 'Particulier', 'Agence immobilière', 'Promotion immobilière'
  propertyOwnerName?: string; // Name of agency or promotion company (only for 'Agence immobilière' or 'Promotion immobilière')
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paper {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaperDto {
  name: string;
}

// Agence interfaces
export interface Agence {
  id: string;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  propertiesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgenceDto {
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
}

export interface UpdateAgenceDto extends Partial<CreateAgenceDto> {}

// Promoteur interfaces
export interface Promoteur {
  id: string;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  projectsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromoteurDto {
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  wilaya?: string;
  daira?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
}

export interface UpdatePromoteurDto extends Partial<CreatePromoteurDto> {}

// Projects (inside Promoteur)
export interface Project {
  id: string;
  promoteurId: string;
  name: string;
  slug?: string;
  description?: string;
  wilaya?: string;
  daira?: string;
  address?: string;
  status?: 'completed' | 'construction' | 'planning' | 'suspended';
  coverImage?: string;
  propertiesCount?: number;
  totalUnits?: number;
  availableUnits?: number;
  deliveryDate?: string;
  floorsCount?: number;
  unitsPerFloor?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  slug?: string;
  description?: string;
  wilaya?: string;
  daira?: string;
  address?: string;
  status?: 'completed' | 'construction' | 'planning' | 'suspended';
  coverImage?: string;
  floorsCount?: number;
  unitsPerFloor?: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface CreatePropertyDto {
  title: string;
  description: string;
  price: string;
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  transactionType: 'vendre' | 'location';
  bedrooms: number;
  bathrooms?: number;
  etage?: number;
  surface: number;
  wilaya: string;
  daira: string;
  address: string;
  iframe360Link?: string;
  phoneNumber?: string;
  apartmentType?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
  amenities?: string[];
  papers?: string[];
  rentPeriod?: 'month' | 'day';
  propertyOwnerType: string; // 'Particulier', 'Agence immobilière', 'Promotion immobilière'
  propertyOwnerName?: string; // Name of agency or promotion company (only for 'Agence immobilière' or 'Promotion immobilière')
  projectId?: string;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {}

export interface CreateNearbyPlaceDto {
  propertyId: string;
  name: string;
  distance: string;
  icon?: string;
  displayOrder?: number;
}

export interface UpdateNearbyPlaceDto {
  name?: string;
  distance?: string;
  icon?: string;
  displayOrder?: number;
}

export interface PropertyFilters {
  type?: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  transactionType?: 'vendre' | 'location';
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSurface?: number;
  maxSurface?: number;
  wilaya?: string;
  daira?: string;
  propertyOwnerType?: string;
  propertyOwnerName?: string;
  projectId?: string;
  has360Tour?: boolean;
  isFeatured?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'surface_asc' | 'surface_desc' | 'newest' | 'oldest' | 'most_viewed';
  limit?: number;
  offset?: number;
}

export interface CreateGeneralContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  company?: string;
}

export interface CreateContactRequestDto {
  name: string;
  email: string;
  phone?: string;
  propertyType: string;
  propertyLocation?: string;
  propertyIntention?: 'sell' | 'rent';
  message?: string;
  whatsappContact?: boolean;
  emailContact?: boolean;
}

export type ContactRequestStatus = 'pending' | 'processed' | 'rejected';

export interface ContactRequest extends CreateContactRequestDto {
  id: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactAnalyticsSummary {
  total: number;
  pending: number;
  processed: number;
  rejected: number;
  last7Days: number;
}

export interface CreateDemandeDto {
  name: string;
  email: string;
  phone?: string;
  propertyType: string;
  propertyLocation: string;
  propertyIntention: 'sell' | 'rent';
  message?: string;
  images?: string[];
  whatsappContact?: boolean;
  emailContact?: boolean;
}

export enum DemandeStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  REJECTED = 'rejected',
}

export interface Demande extends CreateDemandeDto {
  id: string;
  status: DemandeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DemandeAnalyticsSummary {
  total: number;
  pending: number;
  processed: number;
  rejected: number;
  last7Days: number;
}

export interface AuthResponse {
  access_token: string;
  user: any;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PropertySearchParams {
  type?: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  transactionType?: 'vendre' | 'location';
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSurface?: number;
  maxSurface?: number;
  wilaya?: string;
  daira?: string;
  propertyOwnerType?: string;
  propertyOwnerName?: string;
  projectId?: string;
  has360Tour?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'surface_asc' | 'surface_desc' | 'newest' | 'oldest' | 'most_viewed';
  limit?: number;
  offset?: number;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or fallback to localhost for development
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('API Service: Constructor - NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log('API Service: Constructor - Final baseUrl:', this.baseUrl);
    }
    
    // Validate base URL in production
    if (process.env.NODE_ENV === 'production' && !this.baseUrl.startsWith('https://')) {
      console.warn('Warning: API base URL should use HTTPS in production');
    }
  }

  private buildUrl(endpoint: string): string {
    // Only log in development mode
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      console.log('API Service: buildUrl called with endpoint:', endpoint);
      console.log('API Service: baseUrl is:', this.baseUrl);
    }
    
    if (!endpoint) {
      if (isDev) console.log('API Service: No endpoint, returning baseUrl:', this.baseUrl);
      return this.baseUrl;
    }
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      if (isDev) console.log('API Service: Endpoint is absolute URL, returning:', endpoint);
      return endpoint;
    }
    const path = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    const finalUrl = `${this.baseUrl}${path}`;
    if (isDev) console.log('API Service: Final URL constructed:', finalUrl);
    return finalUrl;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.buildUrl(endpoint);
    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      console.log('API Service: Making request to:', url);
      console.log('API Service: Request options:', options);
    }
    
    // Default headers
    const headers: Record<string, string> = {};

    // Add authorization header if token exists
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Merge with any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers as Record<string, string>);
    }

    // If body is NOT FormData, set JSON content-type by default
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (isDev) console.log('API Service: Final headers:', headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (isDev) {
        console.log('API Service: Response status:', response.status);
        console.log('API Service: Response headers:', response.headers);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Service: Error response:', errorData);
        
        // Handle 401 Unauthorized - Token expired or invalid
        if (response.status === 401) {
          if (isDev) console.log('API Service: Token expired or invalid. Logging out user.');
          
          // Clear auth data from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
          
          // Redirect to login page only if we're in the browser
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content (common for DELETE requests) - no response body to parse
      if (response.status === 204) {
        if (isDev) console.log('API Service: Success response (204 No Content)');
        return {} as T;
      }

      // Try to parse JSON, but handle empty responses gracefully
      const text = await response.text();
      if (!text || text.trim() === '') {
        if (isDev) console.log('API Service: Success response (empty body)');
        return {} as T;
      }

      try {
        const responseData = JSON.parse(text);
        if (isDev) console.log('API Service: Success response:', responseData);
        return responseData;
      } catch (parseError) {
        // If JSON parsing fails but status is OK, return empty object
        if (isDev) console.log('API Service: Success response (non-JSON, treating as success)');
        return {} as T;
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  private removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Properties API
  async getProperties(params?: PropertySearchParams): Promise<{ properties: Property[], total: number }> {
    const queryParams = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const endpoint = queryParams ? `/api/properties?${queryParams}` : '/api/properties';
    return this.makeRequest<{ properties: Property[], total: number }>(endpoint);
  }

  async getPropertyBySlug(slug: string): Promise<Property> {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid property slug');
    }
    return this.makeRequest<Property>(`/api/properties/slug/${encodeURIComponent(slug)}`);
  }

  async getFeaturedProperties(): Promise<Property[]> {
    const ts = Date.now();
    return this.makeRequest<Property[]>(`/api/properties/featured?_=${ts}`);
  }

  async getPropertiesStats(): Promise<{ totalProperties: number; activeListings: number; totalValue: number }> {
    const ts = Date.now();
    return this.makeRequest(`/properties/stats?_=${ts}`);
  }

  // Featured properties admin
  async adminListFeatured(token: string): Promise<Array<{ property: Property; position: number }>> {
    const ts = Date.now();
    return this.makeRequest(`/api/properties/featured/admin?_=${ts}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async adminAddFeatured(propertyId: string, token: string): Promise<void> {
    return this.makeRequest(`/api/properties/featured`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ propertyId }),
    });
  }

  async adminRemoveFeatured(propertyId: string, token: string): Promise<void> {
    return this.makeRequest(`/api/properties/featured/${propertyId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async adminReorderFeatured(items: Array<{ propertyId: string; position: number }>, token: string): Promise<void> {
    return this.makeRequest(`/api/properties/featured/reorder`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(items),
    });
  }

  async toggleFeaturedProperty(id: string, token: string): Promise<Property> {
    if (!id) throw new Error('Invalid property ID');
    return this.makeRequest<Property>(`/api/properties/${id}/featured`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  // Site Settings API
  async getHomepageSettings(token: string): Promise<{ id: string; maxSlides: number; maxFeatured: number; createdAt: string; updatedAt: string }> {
    return this.makeRequest(`/api/site-settings/homepage`, { headers: { 'Authorization': `Bearer ${token}` } });
  }

  async updateHomepageSettings(data: { maxSlides?: number; maxFeatured?: number }, token: string): Promise<{ id: string; maxSlides: number; maxFeatured: number; createdAt: string; updatedAt: string }> {
    return this.makeRequest(`/api/site-settings/homepage`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async listCarousel(includeInactive = true, token: string): Promise<any[]> {
    const q = includeInactive ? 'true' : 'false';
    return this.makeRequest(`/api/site-settings/homepage-carousel?includeInactive=${q}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async createCarouselItem(data: { imageUrl: string; altText?: string; linkUrl?: string; isActive?: boolean }, token: string): Promise<any> {
    return this.makeRequest(`/api/site-settings/homepage-carousel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async updateCarouselItem(id: string, data: Partial<{ imageUrl: string; altText: string; linkUrl: string; order: number; isActive: boolean }>, token: string): Promise<any> {
    return this.makeRequest(`/api/site-settings/homepage-carousel/${id}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async deleteCarouselItem(id: string, token: string): Promise<void> {
    return this.makeRequest(`/api/site-settings/homepage-carousel/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async reorderCarousel(items: Array<{ id: string; order: number }>, token: string): Promise<void> {
    return this.makeRequest(`/api/site-settings/homepage-carousel/reorder`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(items),
    });
  }

  async uploadCarouselImage(file: File, token: string): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const url = this.buildUrl(`/api/site-settings/homepage-carousel/upload`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    return response.json();
  }

  async getPublicCarousel(): Promise<Array<{ imageUrl: string; altText?: string; linkUrl?: string }>> {
    return this.makeRequest(`/api/site-settings/homepage-carousel/public`);
  }

  // Analytics API
  async recordVisit(data: { propertyId: string; sessionId?: string; userAgent?: string; ip?: string; wilaya?: string; daira?: string; durationSeconds?: number; }): Promise<{ success: true }>{
    return this.makeRequest<{ success: true }>(`/analytics/visit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Dashboard
  async getAdminDashboardSummary(): Promise<{
    totalProperties: number;
    activeListings: number;
    totalAgences: number;
    totalPromoteurs: number;
    totalProjects: number;
    totalVisits: number;
    totalValueDzd: number;
  }> {
    const ts = Date.now();
    return this.makeRequest(`/api/admin/dashboard/summary?_=${ts}`);
  }

  async getTopViewed(limit = 10): Promise<Array<{ propertyId: string; title: string; views: number }>> {
    const ts = Date.now();
    return this.makeRequest(`/analytics/top-viewed?limit=${limit}&_=${ts}`);
  }

  async getLongestStayed(limit = 10): Promise<Array<{ propertyId: string; title: string; avgDurationSeconds: number }>> {
    return this.makeRequest(`/analytics/longest-stayed?limit=${limit}`);
  }

  async getTopLocations(limit = 10): Promise<Array<{ wilaya: string; daira: string | null; visits: number }>> {
    const ts = Date.now();
    return this.makeRequest(`/analytics/top-locations?limit=${limit}&_=${ts}`);
  }

  async getAnalyticsSummary(): Promise<{ totalVisits: number; last7DaysVisits: number }> {
    const ts = Date.now();
    return this.makeRequest(`/analytics/summary?_=${ts}`);
  }

  async getProperty(id: string): Promise<Property> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid property ID');
    }
    return this.makeRequest<Property>(`/api/properties/${id}`);
  }

  async listAmenities(): Promise<string[]> {
    // Returns raw amenities; UI can label them if needed
    return this.makeRequest<any[]>(ENDPOINTS.PROPERTY_AMENITIES).then(res => res as any);
  }

  async createProperty(data: CreatePropertyDto, token?: string): Promise<Property> {
    // Validate required fields
    if (!data.title || !data.price || !data.address) {
      throw new Error('Missing required fields: title, price, address');
    }
    
    return this.makeRequest<Property>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async updateProperty(id: string, data: Partial<CreatePropertyDto>, token?: string): Promise<Property> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid property ID');
    }
    
    // Ensure price is always a string
    const payload = { ...data };
    if (payload.price !== undefined) {
      payload.price = String(payload.price);
    }
    
    const jsonBody = JSON.stringify(payload);
    
    return this.makeRequest<Property>(`/api/properties/${id}`, {
      method: 'PATCH',
      body: jsonBody,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async deleteProperty(id: string, token?: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid property ID');
    }
    
    return this.makeRequest<void>(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  // Contact API (legacy - now uses demande endpoints)
  async createContactRequest(data: CreateContactRequestDto): Promise<ContactRequest> {
    return this.makeRequest<ContactRequest>(ENDPOINTS.DEMANDES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendContactMessage(data: CreateContactRequestDto | CreateGeneralContactDto): Promise<ContactRequest> {
    // Transform general contact form data to the format expected by backend
    if ('firstName' in data) {
      // This is a general contact form
      const transformedData: CreateContactRequestDto = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        propertyType: data.subject || 'General Inquiry',
        propertyLocation: (data as any).company || '-',
        propertyIntention: 'sell',
        message: `Subject: ${data.subject}\n\n${data.message}`,
        emailContact: true,
        whatsappContact: false,
      };
      return this.createContactRequest(transformedData);
    }
    // This is already in the correct format
    return this.createContactRequest(data);
  }

  async listContactRequests(token: string): Promise<ContactRequest[]> {
    return this.makeRequest<ContactRequest[]>(ENDPOINTS.DEMANDES, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async updateContactStatus(id: string, status: ContactRequestStatus, token: string): Promise<ContactRequest> {
    return this.makeRequest<ContactRequest>(ENDPOINTS.DEMANDE_STATUS(id, status), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deleteContactRequest(id: string, token: string): Promise<void> {
    return this.makeRequest<void>(ENDPOINTS.DEMANDE_ITEM(id), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async getContactAnalytics(token: string): Promise<ContactAnalyticsSummary> {
    return this.makeRequest<ContactAnalyticsSummary>(ENDPOINTS.DEMANDE_ANALYTICS, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  // Demande API
  async createDemande(data: CreateDemandeDto): Promise<Demande> {
    return this.makeRequest<Demande>(ENDPOINTS.DEMANDES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createDemandeWithImages(data: CreateDemandeDto, files: File[]): Promise<Demande> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images') {
          // Skip images field as we'll add files separately
          return;
        }
        formData.append(key, value.toString());
      }
    });
    
    // Add image files
    files.forEach(file => {
      formData.append('images', file);
    });
    
    return this.makeRequest<Demande>(ENDPOINTS.DEMANDES_WITH_IMAGES, {
      method: 'POST',
      body: formData,
    });
  }

  async createDemandeUpload(data: CreateDemandeDto, files: File[]): Promise<Demande> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images') {
          // Skip images field as we'll add files separately
          return;
        }
        formData.append(key, value.toString());
      }
    });
    
    // Add image files
    files.forEach(file => {
      formData.append('images', file);
    });
    
    return this.makeRequest<Demande>(ENDPOINTS.DEMANDES_UPLOAD, {
      method: 'POST',
      body: formData,
    });
  }

  async createDemandeUploadFiles(data: CreateDemandeDto, files: File[]): Promise<Demande> {
    const formData = new FormData();
    
    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images') {
          // Skip images field as we'll add files separately
          return;
        }
        formData.append(key, value.toString());
      }
    });
    
    // Add image files
    files.forEach(file => {
      formData.append('images', file);
    });
    
    // Use fetch directly to avoid Content-Type header conflicts
    const url = this.buildUrl(ENDPOINTS.DEMANDES_UPLOAD_FILES);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - let the browser set it automatically for FormData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async listDemandes(token: string): Promise<Demande[]> {
    return this.makeRequest<Demande[]>(ENDPOINTS.DEMANDES, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async updateDemandeStatus(id: string, status: DemandeStatus, token: string): Promise<Demande> {
    return this.makeRequest<Demande>(ENDPOINTS.DEMANDE_STATUS(id, status), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deleteDemande(id: string, token: string): Promise<void> {
    return this.makeRequest<void>(ENDPOINTS.DEMANDE_ITEM(id), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  async getDemandeAnalytics(token: string): Promise<DemandeAnalyticsSummary> {
    return this.makeRequest<DemandeAnalyticsSummary>(ENDPOINTS.DEMANDE_ANALYTICS, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }

  // Blog API
  async getAllPosts(): Promise<{ success: boolean; data: BlogPost[] }> {
    return this.makeRequest<{ success: boolean; data: BlogPost[] }>(ENDPOINTS.BLOG_POSTS);
  }

  async getPublishedPosts(): Promise<{ success: boolean; data: BlogPost[] }> {
    return this.makeRequest<{ success: boolean; data: BlogPost[] }>(`${ENDPOINTS.BLOG_POSTS}?status=published`);
  }

  async getPost(id: string): Promise<{ success: boolean; data: BlogPost }> {
    return this.makeRequest<{ success: boolean; data: BlogPost }>(ENDPOINTS.BLOG_POST(id));
  }

  async getPostBySlug(slug: string): Promise<{ success: boolean; data: BlogPost }> {
    return this.makeRequest<{ success: boolean; data: BlogPost }>(ENDPOINTS.BLOG_POST_BY_SLUG(slug));
  }

  async createPost(data: CreateBlogPostDto): Promise<{ success: boolean; data: BlogPost }> {
    return this.makeRequest<{ success: boolean; data: BlogPost }>(ENDPOINTS.BLOG_POSTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: string, data: UpdateBlogPostDto): Promise<{ success: boolean; data: BlogPost }> {
    return this.makeRequest<{ success: boolean; data: BlogPost }>(ENDPOINTS.BLOG_POST(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updatePostStatus(id: string, status: BlogPostStatus): Promise<{ success: boolean; data: BlogPost }> {
    return this.makeRequest<{ success: boolean; data: BlogPost }>(ENDPOINTS.BLOG_POST_STATUS(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  }

  async deletePost(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(ENDPOINTS.BLOG_POST(id), {
      method: 'DELETE',
    });
  }

  async uploadPostImage(id: string, file: File): Promise<{ success: boolean; data: BlogPost }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(this.buildUrl(ENDPOINTS.BLOG_POST_IMAGE(id)), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  async deletePostImage(id: string): Promise<{ success: boolean; data: BlogPost }> {
    return this.makeRequest<{ success: boolean; data: BlogPost }>(ENDPOINTS.BLOG_POST_DELETE_IMAGE(id), {
      method: 'DELETE',
    });
  }

  async incrementPostView(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(ENDPOINTS.BLOG_POST_INCREMENT_VIEW(id), {
      method: 'POST',
    });
  }

  async incrementPostLike(id: string): Promise<{ success: boolean }> {
    return this.makeRequest<{ success: boolean }>(ENDPOINTS.BLOG_POST_INCREMENT_LIKE(id), {
      method: 'POST',
    });
  }

  async getBlogAnalytics(): Promise<{ success: boolean; data: BlogAnalytics }> {
    return this.makeRequest<{ success: boolean; data: BlogAnalytics }>(ENDPOINTS.BLOG_ANALYTICS);
  }

  // Locations API (ASCII)
  async getWilayaDairas(): Promise<Record<string, string[]>> {
    return this.makeRequest<Record<string, string[]>>('/api/locations/wilaya-dairas');
  }

  async listWilayas(): Promise<string[]> {
    return this.makeRequest<string[]>('/api/locations/wilayas');
  }

  async listDairas(wilaya: string): Promise<string[]> {
    const encoded = encodeURIComponent(wilaya);
    return this.makeRequest<string[]>(`/api/locations/wilayas/${encoded}/dairas`);
  }

  // Image Upload API
  async uploadImage(file: File, token?: string): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(this.buildUrl('/api/upload/image'), {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Paper API
  async getPapers(): Promise<Paper[]> {
    return this.makeRequest<Paper[]>('/api/papers');
  }

  async createPaper(data: CreatePaperDto, token: string): Promise<Paper> {
    return this.makeRequest<Paper>('/api/papers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updatePaper(id: string, data: CreatePaperDto, token: string): Promise<Paper> {
    return this.makeRequest<Paper>(`/api/papers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deletePaper(id: string, token: string): Promise<void> {
    return this.makeRequest<void>(`/api/papers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async seedPapers(token: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/api/papers/seed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Nearby Places API
  async createNearbyPlace(data: CreateNearbyPlaceDto, token: string): Promise<NearbyPlace> {
    return this.makeRequest<NearbyPlace>('/api/nearby-places', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async getNearbyPlacesByProperty(propertyId: string): Promise<NearbyPlace[]> {
    return this.makeRequest<NearbyPlace[]>(`/api/nearby-places/property/${propertyId}`);
  }

  async updateNearbyPlace(id: string, data: UpdateNearbyPlaceDto, token: string): Promise<NearbyPlace> {
    return this.makeRequest<NearbyPlace>(`/api/nearby-places/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deleteNearbyPlace(id: string, token: string): Promise<void> {
    return this.makeRequest<void>(`/api/nearby-places/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deleteAllNearbyPlaces(propertyId: string, token: string): Promise<void> {
    return this.makeRequest<void>(`/api/nearby-places/property/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Agences API
  async getAgences(): Promise<Agence[]> {
    const ts = Date.now();
    return this.makeRequest<Agence[]>(`/api/agences?_=${ts}`);
  }

  async getAgence(id: string): Promise<Agence> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid agence ID');
    }
    return this.makeRequest<Agence>(`/api/agences/${id}`);
  }

  async getAgenceBySlug(slug: string): Promise<Agence> {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid agence slug');
    }
    return this.makeRequest<Agence>(`/api/agences/slug/${encodeURIComponent(slug)}`);
  }

  async createAgence(data: CreateAgenceDto, token: string): Promise<Agence> {
    if (!data.name || !data.email) {
      throw new Error('Missing required fields: name, email');
    }
    return this.makeRequest<Agence>('/api/agences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateAgence(id: string, data: UpdateAgenceDto, token: string): Promise<Agence> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid agence ID');
    }
    return this.makeRequest<Agence>(`/api/agences/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deleteAgence(id: string, token: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid agence ID');
    }
    return this.makeRequest<void>(`/api/agences/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Promoteurs API
  async getPromoteurs(): Promise<Promoteur[]> {
    const ts = Date.now();
    return this.makeRequest<Promoteur[]>(`/api/promoteurs?_=${ts}`);
  }

  async getPromoteur(id: string): Promise<Promoteur> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid promoteur ID');
    }
    return this.makeRequest<Promoteur>(`/api/promoteurs/${id}`);
  }

  async getPromoteurBySlug(slug: string): Promise<Promoteur> {
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid promoteur slug');
    }
    return this.makeRequest<Promoteur>(`/api/promoteurs/slug/${encodeURIComponent(slug)}`);
  }

  async createPromoteur(data: CreatePromoteurDto, token: string): Promise<Promoteur> {
    if (!data.name || !data.email) {
      throw new Error('Missing required fields: name, email');
    }
    return this.makeRequest<Promoteur>('/api/promoteurs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updatePromoteur(id: string, data: UpdatePromoteurDto, token: string): Promise<Promoteur> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid promoteur ID');
    }
    return this.makeRequest<Promoteur>(`/api/promoteurs/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deletePromoteur(id: string, token: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid promoteur ID');
    }
    return this.makeRequest<void>(`/api/promoteurs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Promoteur Projects API
  async listPromoteurProjects(promoteurId: string): Promise<Project[]> {
    if (!promoteurId || typeof promoteurId !== 'string') {
      throw new Error('Invalid promoteur ID');
    }
    const ts = Date.now();
    return this.makeRequest<Project[]>(`/api/promoteurs/${promoteurId}/projects?_=${ts}`);
  }

  async createPromoteurProject(promoteurId: string, data: CreateProjectDto, token: string): Promise<Project> {
    if (!promoteurId || typeof promoteurId !== 'string') {
      throw new Error('Invalid promoteur ID');
    }
    if (!data?.name) {
      throw new Error('Missing required field: name');
    }
    return this.makeRequest<Project>(`/api/promoteurs/${promoteurId}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async getPromoteurProject(promoteurId: string, projectId: string): Promise<Project> {
    if (!promoteurId || typeof promoteurId !== 'string') throw new Error('Invalid promoteur ID');
    if (!projectId || typeof projectId !== 'string') throw new Error('Invalid project ID');
    return this.makeRequest<Project>(`/api/promoteurs/${promoteurId}/projects/${projectId}`);
  }

  async updatePromoteurProject(promoteurId: string, projectId: string, data: UpdateProjectDto, token: string): Promise<Project> {
    if (!promoteurId || typeof promoteurId !== 'string') throw new Error('Invalid promoteur ID');
    if (!projectId || typeof projectId !== 'string') throw new Error('Invalid project ID');
    return this.makeRequest<Project>(`/api/promoteurs/${promoteurId}/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deletePromoteurProject(promoteurId: string, projectId: string, token: string): Promise<void> {
    if (!promoteurId || typeof promoteurId !== 'string') throw new Error('Invalid promoteur ID');
    if (!projectId || typeof projectId !== 'string') throw new Error('Invalid project ID');
    return this.makeRequest<void>(`/api/promoteurs/${promoteurId}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Auth API
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    const response = await this.makeRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.setAuthToken(response.access_token);
    }
    
    return response;
  }

  async register(userData: CreateUserDto): Promise<AuthResponse> {
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      throw new Error('All user fields are required');
    }
    
    const response = await this.makeRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.access_token) {
      this.setAuthToken(response.access_token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    this.removeAuthToken();
  }

  // User API
  async listUsers(token: string): Promise<any[]> {
    return this.makeRequest<any>(ENDPOINTS.USERS, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createUser(data: any, token: string): Promise<any> {
    return this.makeRequest<any>(ENDPOINTS.USERS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any, token: string): Promise<any> {
    return this.makeRequest<any>(ENDPOINTS.USER(id), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string, token: string): Promise<void> {
    return this.makeRequest<void>(ENDPOINTS.USER(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getUserProfile(token: string): Promise<any> {
    return this.makeRequest<any>(ENDPOINTS.USER_PROFILE, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateUserProfile(userData: any, token: string): Promise<any> {
    return this.makeRequest<any>(ENDPOINTS.UPDATE_PROFILE, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

}

export const apiService = new ApiService();