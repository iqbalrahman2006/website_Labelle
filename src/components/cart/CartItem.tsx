"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils/formatters";

interface CartItemProps {
    item: {
        id: string;
        productId: string;
        variantId?: string;
        quantity: number;
        product: {
            name: string;
            slug: string;
            price: number;
            image?: string;
        };
        variant?: {
            size?: string;
            color?: string;
            priceAdjustment: number;
        };
    };
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem, isLoading } = useCart();

    const itemPrice = item.product.price + (item.variant?.priceAdjustment || 0);
    const itemTotal = itemPrice * item.quantity;

    const handleDecrement = () => {
        updateQuantity(item.id, item.quantity - 1);
    };

    const handleIncrement = () => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleRemove = () => {
        removeItem(item.id);
    };

    return (
        <div className="flex gap-4 py-6 border-b last:border-b-0">
            {/* Product Image */}
            <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-md bg-slate-100">
                    {item.product.image ? (
                        <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-300 text-xs">
                            No Image
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                    <div className="flex-1">
                        <Link
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                            {item.product.name}
                        </Link>

                        {/* Variant Info */}
                        {item.variant && (
                            <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
                                {item.variant.size && (
                                    <span>Size: {item.variant.size}</span>
                                )}
                                {item.variant.color && (
                                    <span>Color: {item.variant.color}</span>
                                )}
                            </div>
                        )}

                        {/* Price */}
                        <div className="mt-2">
                            <span className="font-semibold">{formatCurrency(itemPrice)}</span>
                            {item.variant && item.variant.priceAdjustment !== 0 && (
                                <span className="ml-2 text-sm text-muted-foreground line-through">
                                    {formatCurrency(item.product.price)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Quantity Controls and Total */}
                <div className="flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDecrement}
                            disabled={isLoading || item.quantity <= 1}
                            className="h-8 w-8 rounded-r-none"
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <div className="flex h-8 w-12 items-center justify-center border-x text-sm font-medium">
                            {item.quantity}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleIncrement}
                            disabled={isLoading || item.quantity >= 10}
                            className="h-8 w-8 rounded-l-none"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold">{formatCurrency(itemTotal)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
