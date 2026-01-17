"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useFeaturedProducts } from "@/hooks/useProducts";

export function FeaturedProducts() {
    const { data: products, isLoading } = useFeaturedProducts();

    if (isLoading) {
        return (
            <section className="container py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold">Featured Products</h2>
                        <p className="text-muted-foreground">Handpicked favorites just for you</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-96 bg-slate-100 animate-pulse rounded-lg" />
                    ))}
                </div>
            </section>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="container py-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold">Featured Products</h2>
                    <p className="text-muted-foreground">Handpicked favorites just for you</p>
                </div>
                <Button variant="link" asChild>
                    <Link href="/products?featured=true">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
