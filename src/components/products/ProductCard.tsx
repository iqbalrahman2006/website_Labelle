"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, formatDiscount } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { Product } from "@/hooks/useProducts";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80";

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { isInWishlist, toggleItem } = useWishlist();
    const { addItem } = useCart();
    const inWishlist = isInWishlist(product.id);

    const [imgSrc, setImgSrc] = useState(product.images[0]?.url || "");

    useEffect(() => {
        setImgSrc(product.images[0]?.url || "");
    }, [product.images]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleItem(product.id, {
            name: product.name,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            image: product.images[0]?.url,
        });
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            productId: product.id,
            quantity: 1,
            product: {
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0]?.url,
            },
        });
    };

    const discount = formatDiscount(product.price, product.compareAtPrice || 0);
    const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.inventory === 0;

    return (
        <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg", className)}>
            <Link href={`/products/${product.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    {imgSrc ? (
                        <Image
                            src={imgSrc}
                            alt={product.images[0]?.alt || product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImgSrc(FALLBACK_IMAGE)}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                            No Image
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-2">
                        {product.isNewArrival && (
                            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                        )}
                        {product.isBestseller && (
                            <Badge className="bg-amber-500 hover:bg-amber-600">Bestseller</Badge>
                        )}
                        {discount && (
                            <Badge variant="destructive">{discount}</Badge>
                        )}
                        {isOutOfStock && (
                            <Badge variant="secondary" className="bg-slate-500">Out of Stock</Badge>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white",
                            inWishlist && "text-red-500"
                        )}
                        onClick={handleWishlistToggle}
                    >
                        <Heart className={cn("h-5 w-5", inWishlist && "fill-current")} />
                    </Button>

                    {/* Quick Add to Cart - Shows on Hover */}
                    {!isOutOfStock && (
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                            <Button
                                className="w-full rounded-none"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </Button>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <CardContent className="p-4">
                    {/* Category */}
                    <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">
                        {product.category.name}
                    </p>

                    {/* Product Name */}
                    <h3 className="mb-2 font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {product.reviewCount > 0 && (
                        <div className="mb-2 flex items-center gap-1">
                            <div className="flex items-center">
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                <span className="ml-1 text-sm font-medium">
                                    {product.averageRating.toFixed(1)}
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                ({product.reviewCount})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                            {formatCurrency(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                                {formatCurrency(product.compareAtPrice)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    {!isOutOfStock && product.inventory <= 10 && (
                        <p className="mt-2 text-xs text-amber-600">
                            Only {product.inventory} left in stock
                        </p>
                    )}
                </CardContent>
            </Link>
        </Card>
    );
}
