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
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await productApi.getAll({ limit: 50 });
        if (!isMounted) return;
        const backendProducts = response.data.products.map(transformBackendProduct);

        // Prioritize backend data, then append unique static fallback products
        const combinedProducts: Product[] = [...backendProducts];
        const existingIds = new Set(backendProducts.map(p => p.id));
        const existingSlugs = new Set(backendProducts.map(p => p.slug || '').filter(Boolean));
        const existingNameBrand = new Set(
          backendProducts.map(p => `${p.name.toLowerCase()}::${p.brand.toLowerCase()}`)
        );

        products.forEach(staticProduct => {
          const staticNameBrand = `${staticProduct.name.toLowerCase()}::${staticProduct.brand.toLowerCase()}`;
          if (
            !existingIds.has(staticProduct.id) &&
            !existingSlugs.has(staticProduct.slug || '') &&
            !existingNameBrand.has(staticNameBrand)
          ) {
            combinedProducts.push(staticProduct);
            existingIds.add(staticProduct.id);
            if (staticProduct.slug) existingSlugs.add(staticProduct.slug);
            existingNameBrand.add(staticNameBrand);
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
  }, [enableBackend, showLoading, refreshKey]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableBackend) {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enableBackend]);

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
        
        // Prioritize backend brands, then append unique static fallback brands
        const combinedBrands: Brand[] = [...backendBrands];
        const existingIds = new Set(backendBrands.map(b => b.id));
        const existingSlugs = new Set(backendBrands.map(b => (b as any).slug || '').filter(Boolean));
        const existingNames = new Set(backendBrands.map(b => b.name.toLowerCase()));
        
        brands.forEach(staticBrand => {
          const brandSlug = (staticBrand as any).slug || '';
          const lowerName = staticBrand.name.toLowerCase();
          if (!existingIds.has(staticBrand.id) && !existingSlugs.has(brandSlug) && !existingNames.has(lowerName)) {
            combinedBrands.push(staticBrand);
            existingIds.add(staticBrand.id);
            if (brandSlug) existingSlugs.add(brandSlug);
            existingNames.add(lowerName);
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
        
        // Prioritize backend categories, then append unique static fallback categories
        const combinedCategories: Category[] = [...backendCategories];
        const existingIds = new Set(backendCategories.map(c => c.id));
        const existingSlugs = new Set(backendCategories.map(c => (c as any).slug || '').filter(Boolean));
        const existingNames = new Set(backendCategories.map(c => c.name.toLowerCase()));
        
        categories.forEach(staticCategory => {
          const categorySlug = (staticCategory as any).slug || '';
          const lowerName = staticCategory.name.toLowerCase();
          if (!existingIds.has(staticCategory.id) && !existingSlugs.has(categorySlug) && !existingNames.has(lowerName)) {
            combinedCategories.push(staticCategory);
            existingIds.add(staticCategory.id);
            if (categorySlug) existingSlugs.add(categorySlug);
            existingNames.add(lowerName);
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
    data: products.slice(0, 6),
    loading: false,
    error: null,
    hasBackendData: false,
  });

  useEffect(() => {
    if (!enableBackend) return;

    const fetchBackendFeaturedProducts = async () => {
      if (showLoading) {
        setState(prev => ({ ...prev, loading: true }));
      }

      try {
        const response = await productApi.getFeatured(6);
        const backendFeaturedProducts = response.data.products.map(transformBackendProduct);
        
        // Admin has full control: show ONLY backend-featured products (max 6)
        // If backend has featured products, use them exclusively
        // Otherwise fall back to static products
        const finalProducts = backendFeaturedProducts.length > 0
          ? backendFeaturedProducts.slice(0, 6)
          : products.slice(0, 6);

        setState({
          data: finalProducts,
          loading: false,
          error: null,
          hasBackendData: backendFeaturedProducts.length > 0,
        });
      } catch (error) {
        console.error('Failed to fetch backend featured products:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load additional featured products',
          hasBackendData: false,
        }));
      }
    };

    fetchBackendFeaturedProducts();
  }, [enableBackend, showLoading]);

  return state;
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
    data: categories.slice(0, 6),
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
        
        // Admin has full control: show ONLY backend-featured categories (max 6)
        // If backend has featured categories, use them exclusively
        // Otherwise fall back to static categories
        const finalCategories = backendFeaturedCategories.length > 0
          ? backendFeaturedCategories.slice(0, 6)
          : categories.slice(0, 6);

        setState({
          data: finalCategories,
          loading: false,
          error: null,
          hasBackendData: backendFeaturedCategories.length > 0,
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

