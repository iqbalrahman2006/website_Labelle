import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { format } from "date-fns";

async function getCustomer(id: string) {
    try {
        const customer = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: "desc" },
                    include: { items: true },
                },
                addresses: true,
                reviews: {
                    include: { product: { select: { name: true } } },
                },
                wishlist: {
                    include: { product: { select: { name: true } } },
                },
            },
        });
        return customer;
    } catch (error) {
        console.error("Error fetching customer:", error);
        return null;
    }
}

export default async function CustomerDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const customer = await getCustomer(params.id);

    if (!customer) {
        notFound();
    }

    const totalSpent = customer.orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/customers">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Customers
                    </Button>
                </Link>
            </div>

            {/* Customer Profile */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {customer.name || "N/A"}
                            </h3>
                            <div className="space-y-3">
                                {customer.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-700">
                                            {customer.email}
                                        </span>
                                    </div>
                                )}
                                {customer.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-700">
                                            {customer.phone}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-700">
                                        Member since{" "}
                                        {format(
                                            new Date(customer.createdAt),
                                            "MMMM dd, yyyy"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Orders
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {customer.orders.length}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Spent
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(totalSpent)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Order History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {customer.orders.length === 0 ? (
                        <p className="text-sm text-gray-500">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="text-left py-2 text-sm font-medium text-gray-600">
                                            Order Number
                                        </th>
                                        <th className="text-left py-2 text-sm font-medium text-gray-600">
                                            Items
                                        </th>
                                        <th className="text-left py-2 text-sm font-medium text-gray-600">
                                            Total
                                        </th>
                                        <th className="text-left py-2 text-sm font-medium text-gray-600">
                                            Status
                                        </th>
                                        <th className="text-left py-2 text-sm font-medium text-gray-600">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {customer.orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="py-3">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-3 text-sm text-gray-700">
                                                {order.items.length} items
                                            </td>
                                            <td className="py-3 text-sm font-medium text-gray-900">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="py-3 text-sm text-gray-500">
                                                {format(
                                                    new Date(order.createdAt),
                                                    "MMM dd, yyyy"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Addresses */}
            {customer.addresses.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Saved Addresses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customer.addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-600 uppercase">
                                            {address.addressType}
                                        </span>
                                        {address.isDefault && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {address.name}
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">
                                        {address.addressLine1}
                                    </p>
                                    {address.addressLine2 && (
                                        <p className="text-sm text-gray-700">
                                            {address.addressLine2}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-700">
                                        {address.city}, {address.state}{" "}
                                        {address.pincode}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {address.phone}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
