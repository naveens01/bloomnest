export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Array of product images (2-5 images)
  category: string;
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image: string;
  count: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  image: string;
  productCount: number;
  established: string;
  specialty: string;
}

export interface Review {
  _id: string;
  reviewType: 'product' | 'category' | 'brand';
  targetId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}