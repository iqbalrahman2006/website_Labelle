"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/formatters";
import { Tag } from "lucide-react";

interface CartSummaryProps {
    subtotal: number;
    shipping?: number;
    tax?: number;
    discount?: number;
    onCheckout: () => void;
    isCheckoutDisabled?: boolean;
}

export function CartSummary({
    subtotal,
    shipping = 0,
    tax = 0,
    discount = 0,
    onCheckout,
    isCheckoutDisabled = false,
}: CartSummaryProps) {
    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const total = subtotal + shipping + tax - discount;

    // Free shipping threshold
    const freeShippingThreshold = 999;
    const needsForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const hasFreeShipping = subtotal >= freeShippingThreshold;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsApplyingCoupon(true);
        // TODO: Implement coupon validation API call
        setTimeout(() => {
            setIsApplyingCoupon(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Free Shipping Progress */}
            {!hasFreeShipping && needsForFreeShipping > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-blue-900">
                        Add {formatCurrency(needsForFreeShipping)} more for FREE shipping!
                    </p>
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {hasFreeShipping && (
                <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                        <Badge className="bg-green-500">FREE</Badge>
                        You&apos;ve qualified for free shipping!
                    </p>
                </div>
            )}

            {/* Coupon Code */}
            <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Have a coupon code?
                </label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                    />
                    <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || isApplyingCoupon}
                    >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Order Summary</h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">-{formatCurrency(discount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                            {shipping === 0 ? (
                                <span className="text-green-600">FREE</span>
                            ) : (
                                formatCurrency(shipping)
                            )}
                        </span>
                    </div>

                    {tax > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-medium">{formatCurrency(tax)}</span>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <Button
                size="lg"
                className="w-full"
                onClick={onCheckout}
                disabled={isCheckoutDisabled}
            >
                Proceed to Checkout
            </Button>

            {/* Trust Badges */}
            <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>100% authentic products</span>
                </div>
            </div>
        </div>
    );
}
