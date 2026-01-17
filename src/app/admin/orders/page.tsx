import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { OrdersTable } from "@/components/admin/OrdersTable";

interface SearchParams {
    search?: string;
    status?: string;
    paymentStatus?: string;
}

async function getOrders(searchParams: SearchParams) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                ...(searchParams.status && {
                    status: searchParams.status as any,
                }),
                ...(searchParams.paymentStatus && {
                    paymentStatus: searchParams.paymentStatus as any,
                }),
                ...(searchParams.search && {
                    OR: [
                        {
                            orderNumber: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            customerName: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
            },
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return orders;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const orders = await getOrders(searchParams);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage and process customer orders
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by order number or customer name..."
                        className="pl-10"
                        defaultValue={searchParams.search}
                        name="search"
                    />
                </div>
                <Select defaultValue={searchParams.status || "all"}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Order Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                <Select defaultValue={searchParams.paymentStatus || "all"}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Payments</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Orders Table */}
            <OrdersTable orders={orders} />

            {/* Order Count */}
            <div className="text-sm text-gray-500">
                Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
