"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { format } from "date-fns";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
    user?: { name: string | null; email: string | null } | null;
    items: { product: { name: string } }[];
}

interface OrdersTableProps {
    orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No orders found
                    </h3>
                    <p className="text-sm text-gray-500">
                        Orders will appear here once customers make purchases
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Order Number
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Customer
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Items
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Total
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Payment
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Order Status
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Date
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        {order.orderNumber}
                                    </Link>
                                </td>
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {order.customerName}
                                        </p>
                                        {order.user?.email && (
                                            <p className="text-xs text-gray-500">
                                                {order.user.email}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {order.items.length} item
                                    {order.items.length !== 1 ? "s" : ""}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {formatCurrency(order.total)}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={order.paymentStatus} />
                                </td>
                                <td className="py-3 px-4">
                                    <OrderStatusSelect
                                        orderId={order.id}
                                        currentStatus={order.status}
                                    />
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-end">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
