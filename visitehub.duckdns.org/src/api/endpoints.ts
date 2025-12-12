// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Property endpoints
  PROPERTIES: '/properties',
  PROPERTY_DETAILS: (id: string) => `/properties/${id}`,
  
  // User endpoints
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  USERS: '/users',
  USER: (id: string) => `/users/${id}`,
  
  // Search endpoints
  SEARCH: '/search',

  // Property amenities
  PROPERTY_AMENITIES: '/property-amenities',

  // Demande endpoints
  DEMANDES: '/demandes',
  DEMANDES_WITH_IMAGES: '/demandes/with-images',
  DEMANDES_UPLOAD: '/demandes/upload',
  DEMANDES_UPLOAD_FILES: '/demandes/upload-files',
  DEMANDE_ITEM: (id: string) => `/demandes/${id}`,
  DEMANDE_STATUS: (id: string, status: string) => `/demandes/${id}/status/${status}`,
  DEMANDE_ANALYTICS: '/demandes/analytics/summary',

  // Blog endpoints
  BLOG_POSTS: '/blog',
  BLOG_POST: (id: string) => `/blog/${id}`,
  BLOG_POST_BY_SLUG: (slug: string) => `/blog/slug/${slug}`,
  BLOG_POST_STATUS: (id: string) => `/blog/${id}/status`,
  BLOG_POST_IMAGE: (id: string) => `/blog/${id}/upload-image`,
  BLOG_POST_DELETE_IMAGE: (id: string) => `/blog/${id}/delete-image`,
  BLOG_POST_INCREMENT_VIEW: (id: string) => `/blog/${id}/increment-view`,
  BLOG_POST_INCREMENT_LIKE: (id: string) => `/blog/${id}/increment-like`,
  BLOG_ANALYTICS: '/blog/analytics',
} as const; 