"use client";

import Link from "next/link";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatOrderNumber } from "@/lib/utils/formatters";
import { Order } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";

interface OrderCardProps {
    order: Order;
}

const STATUS_CONFIG = {
    PENDING: { label: "Pending", icon: Package, color: "bg-slate-500" },
    CONFIRMED: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-500" },
    PROCESSING: { label: "Processing", icon: Package, color: "bg-blue-500" },
    PACKED: { label: "Packed", icon: Package, color: "bg-purple-500" },
    SHIPPED: { label: "Shipped", icon: Truck, color: "bg-amber-500" },
    DELIVERED: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
    RETURNED: { label: "Returned", icon: XCircle, color: "bg-orange-500" },
    REFUNDED: { label: "Refunded", icon: CheckCircle, color: "bg-teal-500" },
};

export function OrderCard({ order }: OrderCardProps) {
    const statusConfig = STATUS_CONFIG[order.status];
    const StatusIcon = statusConfig.icon;

    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-lg">
                            Order {formatOrderNumber(order.orderNumber)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <Badge className={cn("w-fit", statusConfig.color)}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Items Preview */}
                <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium">{formatCurrency(item.total)}</span>
                        </div>
                    ))}
                    {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more item(s)
                        </p>
                    )}
                </div>

                {/* Order Total */}
                <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                    <div className="p-3 bg-slate-50 rounded-md">
                        <p className="text-sm font-medium mb-1">Tracking Information</p>
                        <p className="text-sm text-muted-foreground">
                            {order.carrier}: {order.trackingNumber}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/account/orders/${order.id}`}>View Details</Link>
                    </Button>
                    {order.status === 'SHIPPED' && order.trackingNumber && (
                        <Button variant="default" className="flex-1">
                            Track Order
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
