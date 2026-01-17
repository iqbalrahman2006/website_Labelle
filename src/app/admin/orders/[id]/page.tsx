import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { format } from "date-fns";

async function getOrder(id: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: { take: 1, orderBy: { position: "asc" } },
                            },
                        },
                    },
                },
            },
        });
        return order;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}

export default async function OrderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const order = await getOrder(params.id);

    if (!order) {
        notFound();
    }

    const shippingAddress = order.shippingAddress as any;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order {order.orderNumber}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' HH:mm")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 pb-4 border-b last:border-0"
                                    >
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                SKU: {item.sku}
                                            </p>
                                            {item.size && (
                                                <p className="text-sm text-gray-500">
                                                    Size: {item.size}
                                                </p>
                                            )}
                                            {item.color && (
                                                <p className="text-sm text-gray-500">
                                                    Color: {item.color}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(item.price)} × {item.quantity}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">
                                                {formatCurrency(item.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-6 pt-6 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(order.subtotal)}
                                    </span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="font-medium text-green-600">
                                            -{formatCurrency(order.discount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(order.shipping)}
                                    </span>
                                </div>
                                {order.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(order.tax)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-medium text-gray-900">
                                    {shippingAddress.name}
                                </p>
                                <p>{shippingAddress.addressLine1}</p>
                                {shippingAddress.addressLine2 && (
                                    <p>{shippingAddress.addressLine2}</p>
                                )}
                                <p>
                                    {shippingAddress.city}, {shippingAddress.state}{" "}
                                    {shippingAddress.pincode}
                                </p>
                                <p>{shippingAddress.country || "India"}</p>
                                <p className="pt-2">Phone: {shippingAddress.phone}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Current Status
                                </Label>
                                <div className="mt-2">
                                    <OrderStatusSelect
                                        orderId={order.id}
                                        currentStatus={order.status}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Payment Status
                                </Label>
                                <div className="mt-2">
                                    <StatusBadge status={order.paymentStatus} />
                                </div>
                            </div>

                            {order.trackingNumber && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Tracking Number
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {order.trackingNumber}
                                    </p>
                                </div>
                            )}

                            {order.carrier && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                        Carrier
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {order.carrier}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Name</p>
                                <p className="text-sm text-gray-900">
                                    {order.customerName}
                                </p>
                            </div>
                            {order.customerEmail && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Email
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {order.customerEmail}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-700">Phone</p>
                                <p className="text-sm text-gray-900">
                                    {order.customerPhone}
                                </p>
                            </div>
                            {order.user && (
                                <Link href={`/admin/customers/${order.userId}`}>
                                    <Button variant="outline" size="sm" className="w-full mt-2">
                                        View Customer Profile
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {order.paymentMethod && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Payment Method
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {order.paymentMethod}
                                    </p>
                                </div>
                            )}
                            {order.transactionId && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Transaction ID
                                    </p>
                                    <p className="text-sm text-gray-900 font-mono">
                                        {order.transactionId}
                                    </p>
                                </div>
                            )}
                            {order.razorpayPaymentId && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Razorpay Payment ID
                                    </p>
                                    <p className="text-sm text-gray-900 font-mono">
                                        {order.razorpayPaymentId}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <label className={className}>{children}</label>;
}
