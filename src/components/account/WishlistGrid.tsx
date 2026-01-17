"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatCurrency, formatDiscount } from "@/lib/utils/formatters";

interface WishlistItem {
    id: string;
    productId: string;
    product: {
        name: string;
        slug: string;
        price: number;
        compareAtPrice?: number;
        image?: string;
    };
}

interface WishlistGridProps {
    items: WishlistItem[];
}

export function WishlistGrid({ items }: WishlistGridProps) {
    const { removeItem } = useWishlist();
    const { addItem } = useCart();

    const handleAddToCart = async (item: WishlistItem) => {
        await addItem({
            productId: item.productId,
            quantity: 1,
            product: item.product,
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 text-6xl">💝</div>
                <h3 className="mb-2 text-xl font-semibold">Your wishlist is empty</h3>
                <p className="mb-8 text-muted-foreground max-w-md">
                    Save your favorite items here to keep track of them
                </p>
                <Button size="lg" asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
                const discount = formatDiscount(item.product.price, item.product.compareAtPrice || 0);

                return (
                    <Card key={item.id} className="group relative overflow-hidden">
                        <Link href={`/products/${item.product.slug}`}>
                            {/* Image */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                {item.product.image ? (
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-300">
                                        No Image
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {discount && (
                                    <Badge variant="destructive" className="absolute left-2 top-2">
                                        {discount}
                                    </Badge>
                                )}

                                {/* Remove Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeItem(item.id);
                                    }}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Product Info */}
                            <CardContent className="p-4">
                                <h3 className="mb-2 font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                    {item.product.name}
                                </h3>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-lg font-bold">
                                        {formatCurrency(item.product.price)}
                                    </span>
                                    {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                            {formatCurrency(item.product.compareAtPrice)}
                                        </span>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    className="w-full"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(item);
                                    }}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>
                );
            })}
        </div>
    );
}
