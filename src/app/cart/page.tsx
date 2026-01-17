"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

export default function CartPage() {
    const { items, subtotal, syncWithServer } = useCart();

    // Sync cart with server on mount
    useEffect(() => {
        syncWithServer();
    }, [syncWithServer]);

    if (items.length === 0) {
        return <EmptyCart />;
    }

    const handleCheckout = () => {
        // TODO: Navigate to checkout page
        window.location.href = '/checkout';
    };

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Continue Shopping
                    </Link>
                </Button>
                <h1 className="text-4xl font-serif font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground mt-2">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            {/* Cart Content */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                {/* Cart Items */}
                <div className="space-y-4">
                    <div className="border rounded-lg p-6">
                        {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="border rounded-lg p-6">
                        <CartSummary
                            subtotal={subtotal()}
                            onCheckout={handleCheckout}
                            isCheckoutDisabled={items.length === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
