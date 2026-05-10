// API Configuration
// This file centralizes API URL configuration for the entire application

// Get API base URL from environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  health: `${API_BASE_URL}/api/health`,
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  me: `${API_BASE_URL}/api/auth/me`,
  
  // Products
  products: `${API_BASE_URL}/api/products`,
  
  // Categories
  categories: `${API_BASE_URL}/api/categories`,
  
  // Orders
  orders: `${API_BASE_URL}/api/orders`,
  
  // Payment
  createOrder: `${API_BASE_URL}/api/payment/create-order`,
  verifyPayment: `${API_BASE_URL}/api/payment/verify`,
};

// Helper function to get full upload URL
export const getUploadUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/uploads/${path}`;
};

// Helper function for category images
export const getCategoryImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/uploads/categories/${url}`;
};

// Helper function for brand images
export const getBrandImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/uploads/brands/${url}`;
};

// Helper function for product images
export const getProductImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/uploads/products/${url}`;
};

// Debug logging (will be visible in browser console)
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  MODE: import.meta.env.MODE
});

// Made with Bob
