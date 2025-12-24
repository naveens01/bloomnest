import { useState, useEffect, useCallback } from 'react';
import { products, brands, categories } from '../data/products';
import { productApi, brandApi, categoryApi, transformBackendProduct, transformBackendBrand, transformBackendCategory } from '../services/api';
import { Product, Brand, Category } from '../types';

interface UseHybridDataOptions {
  enableBackend?: boolean;
  showLoading?: boolean;
}

interface HybridDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasBackendData: boolean;
}

export function useHybridProducts(options: UseHybridDataOptions = {}) {
  const { enableBackend = true, showLoading = true } = options;
  const [state, setState] = useState<HybridDataState<Product>>({
    data: products,
    loading: false,
    error: null,
    hasBackendData: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enableBackend) return;

    let isMounted = true;

    const fetchBackendProducts = async () => {
      if (showLoading && isMounted) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await productApi.getAll({ limit: 50 });
        const backendProducts = response.data.products.map(transformBackendProduct);
        
        // Combine static and backend products, avoiding duplicates
        const combinedProducts = [...products];
        const existingIds = new Set(products.map(p => p.id));
        
        backendProducts.forEach(backendProduct => {
          if (!existingIds.has(backendProduct.id)) {
            combinedProducts.push(backendProduct);
          }
        });

        if (isMounted) {
          setState({
            data: combinedProducts,
            loading: false,
            error: null,
            hasBackendData: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch backend products:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load additional products',
            hasBackendData: false,
          }));
        }
      }
    };

    fetchBackendProducts();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableBackend, showLoading, refreshKey]);

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enableBackend]);

  // Refetch on focus (user clicks back to window)
  useEffect(() => {
    const handleFocus = () => {
      if (enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enableBackend]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { ...state, refresh };
}

export function useHybridBrands(options: UseHybridDataOptions = {}) {
  const { enableBackend = true, showLoading = true } = options;
  const [state, setState] = useState<HybridDataState<Brand>>({
    data: brands,
    loading: false,
    error: null,
    hasBackendData: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enableBackend) return;

    let isMounted = true;

    const fetchBackendBrands = async () => {
      if (showLoading && isMounted) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await brandApi.getAll();
        if (!isMounted) return;

        const backendBrands = response.data.brands.map(transformBackendBrand);
        
        // Combine static and backend brands, avoiding duplicates by ID
        const combinedBrands = [...brands];
        const existingIds = new Set(brands.map(b => b.id));
        const existingSlugs = new Set(brands.map(b => (b as any).slug || '').filter(Boolean));
        
        backendBrands.forEach(backendBrand => {
          // Check by ID first, then by slug to avoid duplicates
          const brandSlug = (backendBrand as any).slug || '';
          if (!existingIds.has(backendBrand.id) && !existingSlugs.has(brandSlug)) {
            combinedBrands.push(backendBrand);
            existingIds.add(backendBrand.id);
            if (brandSlug) existingSlugs.add(brandSlug);
          }
        });

        if (isMounted) {
          setState({
            data: combinedBrands,
            loading: false,
            error: null,
            hasBackendData: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch backend brands:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load additional brands',
            hasBackendData: false,
          }));
        }
      }
    };

    fetchBackendBrands();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableBackend, showLoading, refreshKey]); // brands is static, don't include in deps

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enableBackend]);

  // Refetch on focus (user clicks back to window)
  useEffect(() => {
    const handleFocus = () => {
      if (enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enableBackend]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { ...state, refresh };
}

export function useHybridCategories(options: UseHybridDataOptions = {}) {
  const { enableBackend = true, showLoading = true } = options;
  const [state, setState] = useState<HybridDataState<Category>>({
    data: categories,
    loading: false,
    error: null,
    hasBackendData: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enableBackend) return;

    let isMounted = true;

    const fetchBackendCategories = async () => {
      if (showLoading && isMounted) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await categoryApi.getAll();
        if (!isMounted) return;

        const backendCategories = response.data.categories.map(transformBackendCategory);
        
        // Combine static and backend categories, avoiding duplicates by ID
        const combinedCategories = [...categories];
        const existingIds = new Set(categories.map(c => c.id));
        const existingSlugs = new Set(categories.map(c => (c as any).slug || '').filter(Boolean));
        
        backendCategories.forEach(backendCategory => {
          // Check by ID first, then by slug to avoid duplicates
          const categorySlug = (backendCategory as any).slug || '';
          if (!existingIds.has(backendCategory.id) && !existingSlugs.has(categorySlug)) {
            combinedCategories.push(backendCategory);
            existingIds.add(backendCategory.id);
            if (categorySlug) existingSlugs.add(categorySlug);
          }
        });

        if (isMounted) {
          setState({
            data: combinedCategories,
            loading: false,
            error: null,
            hasBackendData: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch backend categories:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load additional categories',
            hasBackendData: false,
          }));
        }
      }
    };

    fetchBackendCategories();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableBackend, showLoading, refreshKey]); // categories is static, don't include in deps

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enableBackend]);

  // Refetch on focus (user clicks back to window)
  useEffect(() => {
    const handleFocus = () => {
      if (enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enableBackend]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { ...state, refresh };
}

export function useHybridFeaturedProducts(options: UseHybridDataOptions = {}) {
  const { enableBackend = true, showLoading = true } = options;
  const [state, setState] = useState<HybridDataState<Product>>({
    data: products.filter(p => p.rating >= 4.5).slice(0, 8), // Static featured products
    loading: false,
    error: null,
    hasBackendData: false,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enableBackend) return;

    let isMounted = true;

    const fetchBackendFeaturedProducts = async () => {
      if (showLoading && isMounted) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await productApi.getFeatured(8);
        const backendFeaturedProducts = response.data.products.map(transformBackendProduct);
        
        // Combine static and backend featured products
        const staticFeatured = products.filter(p => p.rating >= 4.5).slice(0, 4);
        const combinedFeatured = [...staticFeatured, ...backendFeaturedProducts];
        
        // Remove duplicates and limit to 8
        const uniqueFeatured = combinedFeatured
          .filter((product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
          )
          .slice(0, 8);

        if (isMounted) {
          setState({
            data: uniqueFeatured,
            loading: false,
            error: null,
            hasBackendData: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch backend featured products:', error);
        if (isMounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load additional featured products',
            hasBackendData: false,
          }));
        }
      }
    };

    fetchBackendFeaturedProducts();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableBackend, showLoading, refreshKey]);

  // Refetch when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enableBackend]);

  // Refetch on focus (user clicks back to window)
  useEffect(() => {
    const handleFocus = () => {
      if (enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enableBackend]);

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { ...state, refresh };
}

export function useHybridFeaturedBrands(options: UseHybridDataOptions = {}) {
  const { enableBackend = true, showLoading = true } = options;
  const [state, setState] = useState<HybridDataState<Brand>>({
    data: brands.filter(b => b.productCount > 5).slice(0, 6), // Static featured brands
    loading: false,
    error: null,
    hasBackendData: false,
  });

  useEffect(() => {
    if (!enableBackend) return;

    const fetchBackendFeaturedBrands = async () => {
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await brandApi.getFeatured();
        const backendFeaturedBrands = response.data.brands.map(transformBackendBrand);
        
        // Combine static and backend featured brands
        const staticFeatured = brands.filter(b => b.productCount > 5).slice(0, 3);
        const combinedFeatured = [...staticFeatured, ...backendFeaturedBrands];
        
        // Remove duplicates and limit to 6
        const uniqueFeatured = combinedFeatured
          .filter((brand, index, self) => 
            index === self.findIndex(b => b.id === brand.id)
          )
          .slice(0, 6);

        setState({
          data: uniqueFeatured,
          loading: false,
          error: null,
          hasBackendData: true,
        });
      } catch (error) {
        console.error('Failed to fetch backend featured brands:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load additional featured brands',
          hasBackendData: false,
        }));
      }
    };

    fetchBackendFeaturedBrands();
  }, [enableBackend, showLoading]);

  return state;
}

export function useHybridFeaturedCategories(options: UseHybridDataOptions = {}) {
  const { enableBackend = true, showLoading = true } = options;
  const [state, setState] = useState<HybridDataState<Category>>({
    data: categories.filter(c => c.count > 50).slice(0, 6), // Static featured categories
    loading: false,
    error: null,
    hasBackendData: false,
  });

  useEffect(() => {
    if (!enableBackend) return;

    const fetchBackendFeaturedCategories = async () => {
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await categoryApi.getFeatured();
        const backendFeaturedCategories = response.data.categories.map(transformBackendCategory);
        
        // Combine static and backend featured categories
        const staticFeatured = categories.filter(c => c.count > 50).slice(0, 3);
        const combinedFeatured = [...staticFeatured, ...backendFeaturedCategories];
        
        // Remove duplicates and limit to 6
        const uniqueFeatured = combinedFeatured
          .filter((category, index, self) => 
            index === self.findIndex(c => c.id === category.id)
          )
          .slice(0, 6);

        setState({
          data: uniqueFeatured,
          loading: false,
          error: null,
          hasBackendData: true,
        });
      } catch (error) {
        console.error('Failed to fetch backend featured categories:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load additional featured categories',
          hasBackendData: false,
        }));
      }
    };

    fetchBackendFeaturedCategories();
  }, [enableBackend, showLoading]);

  return state;
}

