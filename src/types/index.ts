export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
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