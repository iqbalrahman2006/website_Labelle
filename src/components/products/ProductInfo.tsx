"use client";

import { Star, Package, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatRating, formatReviewCount } from "@/lib/utils/formatters";
import { Product } from "@/hooks/useProducts";

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.inventory === 0;
    const isLowStock = !isOutOfStock && product.inventory <= 10;

    return (
        <div className="space-y-6">
            {/* Category */}
            <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {product.category.name}
                </p>
            </div>

            {/* Product Name */}
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            {product.reviewCount > 0 && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-5 w-5",
                                    i < Math.floor(product.averageRating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                )}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{formatRating(product.averageRating)}</span>
                        <span className="text-muted-foreground">
                            {formatReviewCount(product.reviewCount)}
                        </span>
                    </div>
                </div>
            )}

            <Separator />

            {/* Price */}
            <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">{formatCurrency(product.price)}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <>
                            <span className="text-xl text-muted-foreground line-through">
                                {formatCurrency(product.compareAtPrice)}
                            </span>
                            <Badge variant="destructive" className="text-sm">
                                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                            </Badge>
                        </>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div>
                {isOutOfStock ? (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Out of Stock
                    </Badge>
                ) : isLowStock ? (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Only {product.inventory} left in stock
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                        In Stock
                    </Badge>
                )}
            </div>

            <Separator />

            {/* Short Description */}
            {product.shortDesc && (
                <div>
                    <p className="text-base leading-relaxed">{product.shortDesc}</p>
                </div>
            )}

            {/* Product Details */}
            <div className="space-y-3">
                {product.fabric && (
                    <div className="flex gap-2">
                        <span className="font-medium min-w-[100px]">Fabric:</span>
                        <span className="text-muted-foreground">{product.fabric}</span>
                    </div>
                )}
                {product.pattern && (
                    <div className="flex gap-2">
                        <span className="font-medium min-w-[100px]">Pattern:</span>
                        <span className="text-muted-foreground">{product.pattern}</span>
                    </div>
                )}
                {product.sleeveType && (
                    <div className="flex gap-2">
                        <span className="font-medium min-w-[100px]">Sleeve:</span>
                        <span className="text-muted-foreground">{product.sleeveType}</span>
                    </div>
                )}
                {product.occasion && product.occasion.length > 0 && (
                    <div className="flex gap-2">
                        <span className="font-medium min-w-[100px]">Occasion:</span>
                        <span className="text-muted-foreground">{product.occasion.join(", ")}</span>
                    </div>
                )}
            </div>

            <Separator />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Easy Returns</p>
                        <p className="text-xs text-muted-foreground">30 days return policy</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Free Shipping</p>
                        <p className="text-xs text-muted-foreground">On orders over ₹999</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">100% secure checkout</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Quality Assured</p>
                        <p className="text-xs text-muted-foreground">Handpicked collection</p>
                    </div>
                </div>
            </div>

            {/* Full Description */}
            {product.description && (
                <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-3">Product Description</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>
                </>
            )}

            {/* Care Instructions */}
            {product.care && (
                <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-3">Care Instructions</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.care}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
