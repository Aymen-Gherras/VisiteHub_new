// API configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const createApiConfig = (token?: string) => ({
  ...API_CONFIG,
  headers: {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  },
}); 