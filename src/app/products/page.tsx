"use client";

import { Suspense } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters, ProductFilterValues } from "@/components/products/ProductFilters";
import { ProductSort, SortOption } from "@/components/products/ProductSort";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

export default function ProductsPage() {
    const [filters, setFilters] = useState<ProductFilterValues>({});
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    const { data, isLoading } = useProducts({
        ...filters,
        sortBy,
    });

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold mb-2">All Products</h1>
                <p className="text-muted-foreground">
                    Discover our complete collection of Indian ethnic wear
                </p>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <ProductFilters
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                </aside>

                {/* Products Grid */}
                <div className="space-y-6">
                    {/* Header with Sort */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {data?.total || 0} products found
                        </p>
                        <ProductSort value={sortBy} onChange={setSortBy} />
                    </div>

                    {/* Products */}
                    <Suspense fallback={<div>Loading...</div>}>
                        <ProductGrid
                            products={data?.products || []}
                            isLoading={isLoading}
                        />
                    </Suspense>

                    {/* TODO: Add Pagination */}
                </div>
            </div>
        </div>
    );
}
