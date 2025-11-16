const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BackendProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  images: Array<{
    url: string;
    alt?: string;
    isPrimary: boolean;
  }>;
  brand: {
    _id: string;
    name: string;
    logo?: {
      url: string;
      alt?: string;
    };
  };
  category: {
    _id: string;
    name: string;
  };
  inventory: {
    stock: number;
    isInStock: boolean;
  };
  ratings: {
    average: number;
    count: number;
  };
  features: string[];
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: {
    url: string;
    alt?: string;
  };
  website?: string;
  foundedYear?: number;
  industry?: string;
  isFeatured: boolean;
  productCount?: number;
}

export interface BackendCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: {
    url: string;
    alt?: string;
  };
  isFeatured: boolean;
  productCount?: number;
}

// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If response is not JSON, use default message
      }
      
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Product API calls
export const productApi = {
  // Get all products with pagination and filters
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    inStock?: boolean;
  }): Promise<ApiResponse<{ products: BackendProduct[]; pagination: PaginationInfo }>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return apiCall(endpoint);
  },

  // Get featured products
  getFeatured: async (limit?: number): Promise<ApiResponse<{ products: BackendProduct[] }>> => {
    const endpoint = limit ? `/products/featured?limit=${limit}` : '/products/featured';
    return apiCall(endpoint);
  },

  // Get product by slug
  getBySlug: async (slug: string): Promise<ApiResponse<{ product: BackendProduct }>> => {
    return apiCall(`/products/${slug}`);
  },

  // Search products
  search: async (query: string, page?: number, limit?: number): Promise<ApiResponse<{ products: BackendProduct[]; pagination: PaginationInfo }>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page.toString());
    if (limit) searchParams.append('limit', limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products/search/${query}?${queryString}` : `/products/search/${query}`;
    
    return apiCall(endpoint);
  },

  // Get products by category
  getByCategory: async (categoryId: string, page?: number, limit?: number, sort?: string): Promise<ApiResponse<{ products: BackendProduct[]; pagination: PaginationInfo }>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page.toString());
    if (limit) searchParams.append('limit', limit.toString());
    if (sort) searchParams.append('sort', sort);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products/category/${categoryId}?${queryString}` : `/products/category/${categoryId}`;
    
    return apiCall(endpoint);
  },

  // Get products by brand
  getByBrand: async (brandId: string, page?: number, limit?: number, sort?: string): Promise<ApiResponse<{ products: BackendProduct[]; pagination: PaginationInfo }>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page.toString());
    if (limit) searchParams.append('limit', limit.toString());
    if (sort) searchParams.append('sort', sort);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products/brand/${brandId}?${queryString}` : `/products/brand/${brandId}`;
    
    return apiCall(endpoint);
  },
};

// Brand API calls
export const brandApi = {
  // Get all brands
  getAll: async (): Promise<ApiResponse<{ brands: BackendBrand[] }>> => {
    return apiCall('/brands');
  },

  // Get featured brands
  getFeatured: async (): Promise<ApiResponse<{ brands: BackendBrand[] }>> => {
    return apiCall('/brands/featured');
  },

  // Get brand by slug
  getBySlug: async (slug: string): Promise<ApiResponse<{ brand: BackendBrand }>> => {
    return apiCall(`/brands/${slug}`);
  },

  // Get brand products
  getProducts: async (slug: string, page?: number, limit?: number, sort?: string): Promise<ApiResponse<{ brand: BackendBrand; products: BackendProduct[]; pagination: PaginationInfo }>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page.toString());
    if (limit) searchParams.append('limit', limit.toString());
    if (sort) searchParams.append('sort', sort);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/brands/${slug}/products?${queryString}` : `/brands/${slug}/products`;
    
    return apiCall(endpoint);
  },
};

// Category API calls
export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<ApiResponse<{ categories: BackendCategory[] }>> => {
    return apiCall('/categories');
  },

  // Get category tree
  getTree: async (): Promise<ApiResponse<{ categories: BackendCategory[] }>> => {
    return apiCall('/categories/tree');
  },

  // Get root categories
  getRoots: async (): Promise<ApiResponse<{ categories: BackendCategory[] }>> => {
    return apiCall('/categories/roots');
  },

  // Get featured categories
  getFeatured: async (): Promise<ApiResponse<{ categories: BackendCategory[] }>> => {
    return apiCall('/categories/featured');
  },

  // Get category by slug
  getBySlug: async (slug: string): Promise<ApiResponse<{ category: BackendCategory }>> => {
    return apiCall(`/categories/${slug}`);
  },

  // Get category products
  getProducts: async (slug: string, page?: number, limit?: number, sort?: string): Promise<ApiResponse<{ category: BackendCategory; products: BackendProduct[]; pagination: PaginationInfo }>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page.toString());
    if (limit) searchParams.append('limit', limit.toString());
    if (sort) searchParams.append('sort', sort);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/categories/${slug}/products?${queryString}` : `/categories/${slug}/products`;
    
    return apiCall(endpoint);
  },

  // Get subcategories
  getSubcategories: async (slug: string): Promise<ApiResponse<{ subcategories: BackendCategory[] }>> => {
    return apiCall(`/categories/${slug}/subcategories`);
  },
};

// Helper function to generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to normalize image URLs
const normalizeImageUrl = (url: string | undefined): string => {
  if (!url || url.trim() === '') return '';
  // If already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If starts with /uploads, prepend backend URL
  if (url.startsWith('/uploads')) {
    return `http://localhost:5000${url}`;
  }
  // Otherwise, assume it's a relative path from uploads
  return `http://localhost:5000/uploads/${url}`;
};

// Utility function to transform backend data to frontend format
export const transformBackendProduct = (backendProduct: BackendProduct) => {
  const primaryImage = backendProduct.images.find(img => img.isPrimary)?.url || backendProduct.images[0]?.url;
  const brandId = typeof backendProduct.brand === 'object' ? backendProduct.brand._id : backendProduct.brand;
  const brandName = typeof backendProduct.brand === 'object' ? backendProduct.brand.name : backendProduct.brand;
  const categoryId = typeof backendProduct.category === 'object' ? backendProduct.category._id : backendProduct.category;
  const categoryName = typeof backendProduct.category === 'object' ? backendProduct.category.name : backendProduct.category;
  
  return {
  id: backendProduct._id,
  name: backendProduct.name,
  brand: brandName,
  brandId: brandId, // Store brand ID for filtering
  price: backendProduct.price?.current || 0,
  originalPrice: backendProduct.price?.original,
    image: normalizeImageUrl(primaryImage),
  category: categoryName.toLowerCase().replace(/\s+/g, '-'),
  categoryId: categoryId, // Store category ID for filtering
  description: backendProduct.description || '',
  features: backendProduct.features || [],
  inStock: backendProduct.inventory?.isInStock ?? true,
  rating: backendProduct.ratings?.average || 0,
  reviews: backendProduct.ratings?.count || 0,
  slug: backendProduct.slug,
  isFeatured: backendProduct.isFeatured || false,
  createdAt: backendProduct.createdAt,
  };
};

export const transformBackendBrand = (backendBrand: BackendBrand) => {
  // Backend now returns logo.url as data URI (data:image/jpeg;base64,...) when stored in DB
  // Or it might still be a file URL for backward compatibility
  const logoUrl = backendBrand.logo?.url || '';
  // Generate slug from name if slug doesn't exist (for backward compatibility)
  const slug = backendBrand.slug || generateSlug(backendBrand.name);
  
  // Use logo URL as is - it's either a data URI (for DB-stored images) or a file URL
  let normalizedLogoUrl = logoUrl;
  
  // Only normalize if it's not already a data URI and not a full URL
  if (logoUrl && !logoUrl.startsWith('data:') && !logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
    // Handle legacy file paths
    if (logoUrl.startsWith('/uploads')) {
      normalizedLogoUrl = `http://localhost:5000${logoUrl}`;
    } else if (logoUrl.includes('brands/')) {
      normalizedLogoUrl = `http://localhost:5000/uploads/${logoUrl}`;
    } else {
      normalizedLogoUrl = `http://localhost:5000/uploads/brands/${logoUrl}`;
    }
  }
  
  return {
  id: backendBrand._id,
  name: backendBrand.name,
    logo: normalizedLogoUrl,
  description: backendBrand.description || '',
    image: normalizedLogoUrl || '', // Use logo as image, or empty if no logo
  productCount: backendBrand.productCount || 0,
  established: backendBrand.foundedYear?.toString() || '',
  specialty: backendBrand.industry || '',
  slug: slug,
  isFeatured: backendBrand.isFeatured,
  };
};

export const transformBackendCategory = (backendCategory: BackendCategory) => {
  const imageUrl = backendCategory.image?.url || '';
  return {
  id: backendCategory._id,
  name: backendCategory.name,
    image: normalizeImageUrl(imageUrl),
  count: backendCategory.productCount || 0,
  slug: backendCategory.slug,
  isFeatured: backendCategory.isFeatured,
  };
};

// Admin API calls (requires authentication)
export const adminApi = {
  // Get auth token from localStorage
  getAuthHeaders: (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // Categories CRUD
  categories: {
    getAll: async (): Promise<ApiResponse<{ categories: BackendCategory[] }>> => {
      return apiCall('/admin/categories', {
        method: 'GET',
        headers: adminApi.getAuthHeaders(),
      });
    },
    create: async (data: FormData): Promise<ApiResponse<{ category: BackendCategory }>> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      return response.json();
    },
    update: async (id: string, data: FormData): Promise<ApiResponse<{ category: BackendCategory }>> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      return response.json();
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return apiCall(`/admin/categories/${id}`, {
        method: 'DELETE',
        headers: adminApi.getAuthHeaders(),
      });
    },
  },

  // Brands CRUD
  brands: {
    getAll: async (): Promise<ApiResponse<{ brands: BackendBrand[] }>> => {
      return apiCall('/admin/brands', {
        method: 'GET',
        headers: adminApi.getAuthHeaders(),
      });
    },
    create: async (data: FormData): Promise<ApiResponse<{ brand: BackendBrand }>> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/brands`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });
      if (!response.ok) {
        let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If response is not JSON, use default message
        }
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }
      return response.json();
    },
    update: async (id: string, data: FormData): Promise<ApiResponse<{ brand: BackendBrand }>> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/brands/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });
      if (!response.ok) {
        let errorMessage = `API call failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          // If response is not JSON, use default message
        }
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }
      return response.json();
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return apiCall(`/admin/brands/${id}`, {
        method: 'DELETE',
        headers: adminApi.getAuthHeaders(),
      });
    },
  },

  // Products CRUD
  products: {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      brand?: string;
      status?: string;
    }): Promise<ApiResponse<{ products: BackendProduct[]; pagination: PaginationInfo }>> => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }
      const queryString = searchParams.toString();
      const endpoint = queryString ? `/admin/products?${queryString}` : '/admin/products';
      return apiCall(endpoint, {
        method: 'GET',
        headers: adminApi.getAuthHeaders(),
      });
    },
    create: async (data: FormData): Promise<ApiResponse<{ product: BackendProduct }>> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      return response.json();
    },
    update: async (id: string, data: FormData): Promise<ApiResponse<{ product: BackendProduct }>> => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      return response.json();
    },
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return apiCall(`/admin/products/${id}`, {
        method: 'DELETE',
        headers: adminApi.getAuthHeaders(),
      });
    },
    setFeatured: async (id: string, isFeatured: boolean): Promise<ApiResponse<{ product: BackendProduct }>> => {
      return apiCall(`/admin/products/${id}`, {
        method: 'PUT',
        headers: adminApi.getAuthHeaders(),
        body: JSON.stringify({ isFeatured }),
      });
    },
  },
};

