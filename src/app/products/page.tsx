"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters, ProductFilterValues } from "@/components/products/ProductFilters";
import { ProductSort, SortOption } from "@/components/products/ProductSort";
import { useProducts, useCategories } from "@/hooks/useProducts";

function ProductsContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const featuredParam = searchParams.get("featured");
    const searchParam = searchParams.get("search");

    const [filters, setFilters] = useState<ProductFilterValues>({});
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Sync search params with state
    useEffect(() => {
        const newFilters: ProductFilterValues = {};
        
        if (categoryParam) {
            newFilters.categories = [categoryParam];
        }
        
        if (featuredParam === "true") {
            // @ts-ignore
            newFilters.featured = true;
        }

        if (searchParam) {
            // @ts-ignore
            newFilters.search = searchParam;
        }

        setFilters(newFilters);
    }, [categoryParam, featuredParam, searchParam]);

    const { data: categoriesData } = useCategories();
    const { data, isLoading } = useProducts({
        // Map categories to category ID / slug if filtering
        category: filters.categories?.[0], // The backend route supports slug
        // @ts-ignore
        featured: filters.featured ? 'true' : undefined,
        // @ts-ignore
        search: filters.search,
        sortBy,
        sizes: filters.sizes,
        colors: filters.colors,
        occasions: filters.occasions,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
    });

    // Determine Title based on active category
    let pageTitle = "All Products";
    let pageDesc = "Discover our complete collection of premium Indian ethnic wear";

    if (categoryParam && categoriesData) {
        const activeCat = categoriesData.find(c => c.slug === categoryParam || c.id === categoryParam);
        if (activeCat) {
            pageTitle = activeCat.name;
            pageDesc = activeCat.description || `Browse our exclusive collection of ${activeCat.name.toLowerCase()}`;
            
            // If kids, make sure it says under 7
            if (activeCat.slug === "kids-ethnic-wear") {
                pageDesc = "Adorable traditional outfits for boys and girls under 7 years old";
            }
        }
    }

    return (
        <div className="container py-8 min-h-screen">
            <div className="mb-8 border-b pb-6">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">LaBelle Boutique</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-1 mb-2">{pageTitle}</h1>
                <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
                    {pageDesc}
                </p>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <ProductFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        categories={categoriesData || []}
                    />
                </aside>

                {/* Products Grid */}
                <div className="space-y-6">
                    {/* Header with Sort */}
                    <div className="flex items-center justify-between border-b pb-4">
                        <p className="text-sm font-medium text-foreground/80">
                            Showing <span className="text-primary font-bold">{data?.total || 0}</span> elegant creations
                        </p>
                        <ProductSort value={sortBy} onChange={setSortBy} />
                    </div>

                    {/* Products */}
                    <ProductGrid
                        products={data?.products || []}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container py-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-serif italic">Loading our collections...</p>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
