export type UserRole = 'client' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// types/company.ts
export interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  stats: {
    propertiesSold: number;
    clientSatisfaction: number;
    averageSaleTime: string;
  };
}