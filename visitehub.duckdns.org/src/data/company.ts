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
    [key: string]: string | undefined;
  };
  stats: {
    propertiesSold: number;
    clientSatisfaction: number;
    averageSaleTime: string;
  };
}