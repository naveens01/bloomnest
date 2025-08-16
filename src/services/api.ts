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
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
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

// Utility function to transform backend data to frontend format
export const transformBackendProduct = (backendProduct: BackendProduct) => ({
  id: backendProduct._id,
  name: backendProduct.name,
  brand: backendProduct.brand.name,
  price: backendProduct.price.current,
  originalPrice: backendProduct.price.original,
  image: backendProduct.images.find(img => img.isPrimary)?.url || backendProduct.images[0]?.url || '',
  category: backendProduct.category.name.toLowerCase().replace(/\s+/g, '-'),
  description: backendProduct.description,
  features: backendProduct.features,
  inStock: backendProduct.inventory.isInStock,
  rating: backendProduct.ratings.average,
  reviews: backendProduct.ratings.count,
  slug: backendProduct.slug,
  isFeatured: backendProduct.isFeatured,
  createdAt: backendProduct.createdAt,
});

export const transformBackendBrand = (backendBrand: BackendBrand) => ({
  id: backendBrand._id,
  name: backendBrand.name,
  logo: backendBrand.logo?.url || '',
  description: backendBrand.description || '',
  image: backendBrand.logo?.url || '',
  productCount: backendBrand.productCount || 0,
  established: backendBrand.foundedYear?.toString() || '',
  specialty: backendBrand.industry || '',
  slug: backendBrand.slug,
  isFeatured: backendBrand.isFeatured,
});

export const transformBackendCategory = (backendCategory: BackendCategory) => ({
  id: backendCategory._id,
  name: backendCategory.name,
  image: backendCategory.image?.url || '',
  count: backendCategory.productCount || 0,
  slug: backendCategory.slug,
  isFeatured: backendCategory.isFeatured,
});

