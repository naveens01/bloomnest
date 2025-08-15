import { Product, Category, Brand } from '../types';

export const categories: Category[] = [
  {
    id: 'home-living',
    name: 'Home & Living',
    image: 'https://images.pexels.com/photos/6957241/pexels-photo-6957241.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 156
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 89
  },
  {
    id: 'fashion',
    name: 'Sustainable Fashion',
    image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 234
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 67
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 43
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    count: 78
  }
];

export const brands: Brand[] = [
  {
    id: 'ecolife',
    name: 'EcoLife',
    logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Sustainable living products made from natural materials',
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 12,
    established: '2018',
    specialty: 'Kitchen & Home'
  },
  {
    id: 'greencarry',
    name: 'GreenCarry',
    logo: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Eco-friendly bags and accessories for conscious consumers',
    image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 8,
    established: '2020',
    specialty: 'Fashion & Accessories'
  },
  {
    id: 'pureessence',
    name: 'PureEssence',
    logo: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Natural skincare and personal care products',
    image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 15,
    established: '2017',
    specialty: 'Personal Care'
  },
  {
    id: 'crystalpure',
    name: 'CrystalPure',
    logo: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Premium glass products for sustainable living',
    image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 6,
    established: '2019',
    specialty: 'Drinkware'
  },
  {
    id: 'teagarden',
    name: 'TeaGarden',
    logo: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Organic teas and beverages from sustainable farms',
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 10,
    established: '2016',
    specialty: 'Beverages'
  },
  {
    id: 'smilebright',
    name: 'SmileBright',
    logo: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=100',
    description: 'Sustainable oral care products for the whole family',
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
    productCount: 7,
    established: '2021',
    specialty: 'Oral Care'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Bamboo Kitchen Utensil Set',
    brand: 'EcoLife',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'home-living',
    description: 'Complete bamboo kitchen utensil set including spatula, spoon, fork, and tongs. Made from sustainable bamboo.',
    features: ['100% Bamboo', 'Heat Resistant', 'Non-toxic', 'Dishwasher Safe'],
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Organic Cotton Tote Bag',
    brand: 'GreenCarry',
    price: 15.99,
    image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'fashion',
    description: 'Durable organic cotton tote bag perfect for shopping and daily use. Eco-friendly alternative to plastic bags.',
    features: ['Organic Cotton', 'Machine Washable', 'Strong Handles', 'Large Capacity'],
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    name: 'Natural Soap Bar Set',
    brand: 'PureEssence',
    price: 24.99,
    originalPrice: 32.99,
    image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'personal-care',
    description: 'Set of 3 handmade natural soap bars with essential oils. Free from chemicals and artificial fragrances.',
    features: ['Handmade', 'Essential Oils', 'Chemical-free', 'Moisturizing'],
    inStock: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: '4',
    name: 'Reusable Glass Water Bottles',
    brand: 'CrystalPure',
    price: 19.99,
    image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'home-living',
    description: 'Set of 2 borosilicate glass water bottles with protective silicone sleeves. BPA-free and eco-friendly.',
    features: ['Borosilicate Glass', 'BPA-free', 'Silicone Sleeve', 'Leak-proof'],
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '5',
    name: 'Organic Herbal Tea Blend',
    brand: 'TeaGarden',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'food-beverages',
    description: 'Premium organic herbal tea blend with chamomile, lavender, and mint. Calming and refreshing.',
    features: ['Organic Certified', 'Caffeine-free', 'Relaxing Blend', 'Compostable Packaging'],
    inStock: true,
    rating: 4.5,
    reviews: 67
  },
  {
    id: '6',
    name: 'Bamboo Toothbrush Set',
    brand: 'SmileBright',
    price: 8.99,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'personal-care',
    description: 'Set of 4 bamboo toothbrushes with soft bristles. Biodegradable and plastic-free oral care.',
    features: ['Biodegradable', 'Soft Bristles', 'Plastic-free', 'Ergonomic Handle'],
    inStock: true,
    rating: 4.4,
    reviews: 98
  },
  {
    id: '7',
    name: 'Organic Cotton Baby Onesies',
    brand: 'TinyEco',
    price: 34.99,
    originalPrice: 42.99,
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'baby-kids',
    description: 'Set of 3 organic cotton baby onesies in different colors. Soft, breathable, and safe for sensitive skin.',
    features: ['100% Organic Cotton', 'Hypoallergenic', 'Machine Washable', 'Snap Closure'],
    inStock: true,
    rating: 4.8,
    reviews: 145
  },
  {
    id: '8',
    name: 'Natural Yoga Mat',
    brand: 'ZenEarth',
    price: 69.99,
    image: 'https://images.pexels.com/photos/317155/pexels-photo-317155.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'wellness',
    description: 'Premium natural rubber yoga mat with cork top layer. Non-slip, eco-friendly, and durable.',
    features: ['Natural Rubber', 'Cork Surface', 'Non-slip', 'Eco-friendly'],
    inStock: true,
    rating: 4.9,
    reviews: 87
  }
];