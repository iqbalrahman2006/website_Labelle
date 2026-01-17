"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
}

export function ProductGrid({
    products,
    isLoading = false,
    emptyMessage = "No products found",
    className,
}: ProductGridProps) {
    if (isLoading) {
        return (
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 text-6xl">🛍️</div>
                <h3 className="mb-2 text-xl font-semibold">{emptyMessage}</h3>
                <p className="text-muted-foreground">
                    Try adjusting your filters or search criteria
                </p>
            </div>
        );
    }

    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCardSkeleton() {
    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            {/* Image Skeleton */}
            <div className="aspect-[3/4] animate-pulse bg-slate-200" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="flex items-center gap-2">
                    <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                </div>
            </div>
        </div>
    );
}
