"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { VariantSelector } from "@/components/products/VariantSelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ReviewSection } from "@/components/products/ReviewSection";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProduct } from "@/hooks/useProducts";

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    const { data: product, isLoading } = useProduct(params.slug);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="aspect-square bg-slate-100 animate-pulse rounded-lg" />
                    <div className="space-y-4">
                        <div className="h-8 bg-slate-100 animate-pulse rounded" />
                        <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4" />
                        <div className="h-12 bg-slate-100 animate-pulse rounded w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        notFound();
    }

    const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.inventory === 0;
    const maxQuantity = selectedVariant ? selectedVariant.inventory : product.inventory;

    return (
        <div className="container py-8">
            {/* Product Details */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                {/* Gallery */}
                <ProductGallery images={product.images} productName={product.name} />

                {/* Info and Actions */}
                <div className="space-y-8">
                    <ProductInfo product={product} />

                    <Separator />

                    {/* Variant Selection */}
                    {product.variants && product.variants.length > 0 && (
                        <>
                            <VariantSelector
                                variants={product.variants}
                                basePrice={product.price}
                                onVariantChange={setSelectedVariant}
                            />
                            <Separator />
                        </>
                    )}

                    {/* Add to Cart */}
                    <AddToCartButton
                        productId={product.id}
                        productName={product.name}
                        productSlug={product.slug}
                        productPrice={product.price + (selectedVariant?.priceAdjustment || 0)}
                        productImage={product.images[0]?.url}
                        variantId={selectedVariant?.id}
                        maxQuantity={Math.min(maxQuantity, 10)}
                        isOutOfStock={isOutOfStock}
                    />
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="reviews" className="mb-16">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="mt-8">
                    <ReviewSection
                        reviews={[]} // TODO: Fetch reviews from API
                        averageRating={product.averageRating}
                        totalReviews={product.reviewCount}
                    />
                </TabsContent>

                <TabsContent value="description" className="mt-8">
                    <div className="prose max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="details" className="mt-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Product Information</h3>
                            <dl className="space-y-2">
                                <div className="flex gap-4">
                                    <dt className="font-medium min-w-[120px]">SKU:</dt>
                                    <dd className="text-muted-foreground">{product.sku}</dd>
                                </div>
                                {product.fabric && (
                                    <div className="flex gap-4">
                                        <dt className="font-medium min-w-[120px]">Fabric:</dt>
                                        <dd className="text-muted-foreground">{product.fabric}</dd>
                                    </div>
                                )}
                                {product.pattern && (
                                    <div className="flex gap-4">
                                        <dt className="font-medium min-w-[120px]">Pattern:</dt>
                                        <dd className="text-muted-foreground">{product.pattern}</dd>
                                    </div>
                                )}
                                {product.sleeveType && (
                                    <div className="flex gap-4">
                                        <dt className="font-medium min-w-[120px]">Sleeve Type:</dt>
                                        <dd className="text-muted-foreground">{product.sleeveType}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {product.care && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg">Care Instructions</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {product.care}
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* TODO: Related Products Section */}
        </div>
    );
}
