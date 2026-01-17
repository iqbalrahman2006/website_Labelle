import { useQuery, UseQueryResult } from '@tanstack/react-query';

// Types
export interface Product {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string;
    shortDesc?: string;
    price: number;
    compareAtPrice?: number;
    inventory: number;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'OUT_OF_STOCK';
    isFeatured: boolean;
    isNewArrival: boolean;
    isBestseller: boolean;
    averageRating: number;
    reviewCount: number;
    images: Array<{
        id: string;
        url: string;
        alt?: string;
        position: number;
    }>;
    variants: Array<{
        id: string;
        sku: string;
        size?: string;
        color?: string;
        colorHex?: string;
        priceAdjustment: number;
        inventory: number;
        isActive: boolean;
    }>;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    fabric?: string;
    care?: string;
    occasion: string[];
    pattern?: string;
    sleeveType?: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    occasions?: string[];
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';
    page?: number;
    pageSize?: number;
    search?: string;
}

// Fetch products with filters
async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v.toString()));
            } else {
                params.append(key, value.toString());
            }
        }
    });

    const response = await fetch(`/api/products?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return response.json();
}

// Fetch single product by slug
async function fetchProduct(slug: string): Promise<Product> {
    const response = await fetch(`/api/products/${slug}`);

    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }

    return response.json();
}

// Fetch featured products
async function fetchFeaturedProducts(): Promise<Product[]> {
    const response = await fetch('/api/products?isFeatured=true&pageSize=8');

    if (!response.ok) {
        throw new Error('Failed to fetch featured products');
    }

    const data = await response.json();
    return data.products;
}

// Fetch new arrivals
async function fetchNewArrivals(): Promise<Product[]> {
    const response = await fetch('/api/products?isNewArrival=true&sortBy=newest&pageSize=8');

    if (!response.ok) {
        throw new Error('Failed to fetch new arrivals');
    }

    const data = await response.json();
    return data.products;
}

// Fetch bestsellers
async function fetchBestsellers(): Promise<Product[]> {
    const response = await fetch('/api/products?isBestseller=true&pageSize=8');

    if (!response.ok) {
        throw new Error('Failed to fetch bestsellers');
    }

    const data = await response.json();
    return data.products;
}

// Hooks

/**
 * Hook to fetch products with filters
 */
export function useProducts(filters: ProductFilters = {}): UseQueryResult<ProductsResponse> {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch a single product by slug
 */
export function useProduct(slug: string): UseQueryResult<Product> {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: () => fetchProduct(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch featured products
 */
export function useFeaturedProducts(): UseQueryResult<Product[]> {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: fetchFeaturedProducts,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch new arrivals
 */
export function useNewArrivals(): UseQueryResult<Product[]> {
    return useQuery({
        queryKey: ['products', 'new-arrivals'],
        queryFn: fetchNewArrivals,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch bestsellers
 */
export function useBestsellers(): UseQueryResult<Product[]> {
    return useQuery({
        queryKey: ['products', 'bestsellers'],
        queryFn: fetchBestsellers,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
