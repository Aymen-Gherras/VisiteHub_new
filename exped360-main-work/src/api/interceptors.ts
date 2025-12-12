// API interceptors for request/response handling
export const setupInterceptors = (apiInstance: unknown) => {
  // Request interceptor
  (apiInstance as any).interceptors.request.use(
    (config: unknown) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        (config as any).headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  (apiInstance as any).interceptors.response.use(
    (response: unknown) => {
      return response;
    },
    (error: unknown) => {
      // Handle common errors
      if ((error as any).response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}; 