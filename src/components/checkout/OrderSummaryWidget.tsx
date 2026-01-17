"use client";

import { formatCurrency } from "@/lib/utils/formatters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

interface OrderSummaryWidgetProps {
    items: Array<{
        id: string;
        name: string;
        image?: string;
        quantity: number;
        price: number;
        total: number;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    discount?: number;
    total: number;
    editable?: boolean;
}

export function OrderSummaryWidget({
    items,
    subtotal,
    shipping,
    tax,
    discount = 0,
    total,
    editable = false,
}: OrderSummaryWidgetProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Order Summary</h3>
                    {editable && (
                        <Link href="/cart" className="text-sm text-primary hover:underline">
                            Edit Cart
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                        No Image
                                    </div>
                                )}
                                <Badge
                                    variant="secondary"
                                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    {item.quantity}
                                </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatCurrency(item.price)} × {item.quantity}
                                </p>
                            </div>
                            <div className="text-sm font-medium">
                                {formatCurrency(item.total)}
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
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
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (GST 18%)</span>
                        <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">-{formatCurrency(discount)}</span>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
