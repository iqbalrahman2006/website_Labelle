"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
    productId: string;
    productName: string;
    productSlug: string;
    productPrice: number;
    productImage?: string;
    variantId?: string;
    maxQuantity?: number;
    isOutOfStock?: boolean;
    className?: string;
}

export function AddToCartButton({
    productId,
    productName,
    productSlug,
    productPrice,
    productImage,
    variantId,
    maxQuantity = 10,
    isOutOfStock = false,
    className,
}: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(1);
    const { addItem, isLoading } = useCart();
    const { toggleItem, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(productId);

    const handleDecrement = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const handleIncrement = () => {
        setQuantity((prev) => Math.min(maxQuantity, prev + 1));
    };

    const handleAddToCart = async () => {
        await addItem({
            productId,
            variantId,
            quantity,
            product: {
                name: productName,
                slug: productSlug,
                price: productPrice,
                image: productImage,
            },
        });
    };

    const handleWishlistToggle = () => {
        toggleItem(productId, {
            name: productName,
            slug: productSlug,
            price: productPrice,
            image: productImage,
        });
    };

    if (isOutOfStock) {
        return (
            <div className={cn("space-y-3", className)}>
                <Button variant="secondary" size="lg" className="w-full" disabled>
                    Out of Stock
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleWishlistToggle}
                >
                    <Heart className={cn("mr-2 h-5 w-5", inWishlist && "fill-current text-red-500")} />
                    {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-r-none"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex h-10 w-16 items-center justify-center border-x text-sm font-medium">
                        {quantity}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleIncrement}
                        disabled={quantity >= maxQuantity}
                        className="h-10 w-10 rounded-l-none"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {maxQuantity <= 10 && (
                    <span className="text-xs text-muted-foreground">
                        Max {maxQuantity} per order
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="px-4"
                    onClick={handleWishlistToggle}
                >
                    <Heart className={cn("h-5 w-5", inWishlist && "fill-current text-red-500")} />
                </Button>
            </div>

            {/* Buy Now Button */}
            <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={async () => {
                    await handleAddToCart();
                    // TODO: Navigate to cart/checkout
                    window.location.href = '/cart';
                }}
                disabled={isLoading}
            >
                Buy Now
            </Button>
        </div>
    );
}
