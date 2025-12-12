export type ServiceTier = 'basic' | 'premium_360';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
export type PropertyStatus = 'active' | 'inactive' | 'sold';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  address: string;
  city: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  serviceTier: ServiceTier;
  status: PropertyStatus;
  features: string[];
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    isAgency: boolean;
  };
  has360Tour: boolean;
  tour360Url?: string;
  viewCount: number;
  createdAt: string;
}