"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const orderNumber = params.orderNumber as string;
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch order details from API
        // For now, using mock data
        setIsLoading(false);
        setOrder({
            orderNumber,
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            total: 2999,
            createdAt: new Date().toISOString(),
        });
    }, [orderNumber]);

    if (isLoading) {
        return (
            <div className="container py-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    We couldn&apos;t find the order you&apos;re looking for.
                </p>
                <Button asChild>
                    <Link href="/account">View My Orders</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-muted-foreground mb-4">
                        Thank you for your purchase
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                        <span className="text-sm text-muted-foreground">Order Number:</span>
                        <span className="font-semibold">{orderNumber}</span>
                    </div>
                </div>

                {/* Order Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Order Details</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Order Total</p>
                                <p className="font-medium text-lg">{formatCurrency(order.total)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                                <Badge className="bg-green-500">
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                                <Badge className="bg-blue-500">
                                    {order.status}
                                </Badge>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Estimated Delivery</p>
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                <p className="font-medium">
                                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* What's Next */}
                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">What&apos;s Next?</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">1</span>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Order Confirmation Email</p>
                                <p className="text-sm text-muted-foreground">
                                    We&apos;ve sent a confirmation email with your order details
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">2</span>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Order Processing</p>
                                <p className="text-sm text-muted-foreground">
                                    We&apos;re preparing your items for shipment
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">3</span>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Shipping Notification</p>
                                <p className="text-sm text-muted-foreground">
                                    You&apos;ll receive tracking details once your order ships
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1" asChild>
                        <Link href={`/account/orders/${orderNumber}`}>
                            View Order Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1" asChild>
                        <Link href="/products">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>

                {/* Download Invoice */}
                <div className="mt-6 text-center">
                    <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                    </Button>
                </div>
            </div>
        </div>
    );
}
