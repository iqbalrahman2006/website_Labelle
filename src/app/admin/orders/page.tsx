import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { OrdersFilter } from "@/components/admin/OrdersFilter";

interface SearchParams {
    search?: string;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
}

async function getOrders(searchParams: SearchParams) {
    try {
        const where: any = {};

        if (searchParams.status && searchParams.status !== "all") {
            where.status = searchParams.status as any;
        }

        if (searchParams.paymentStatus && searchParams.paymentStatus !== "all") {
            where.paymentStatus = searchParams.paymentStatus as any;
        }

        if (searchParams.search) {
            where.OR = [
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
            ];
        }

        if (searchParams.startDate || searchParams.endDate) {
            const dateFilter: any = {};
            if (searchParams.startDate) {
                dateFilter.gte = new Date(searchParams.startDate);
            }
            if (searchParams.endDate) {
                const end = new Date(searchParams.endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.lte = end;
            }
            where.createdAt = dateFilter;
        }

        const orders = await prisma.order.findMany({
            where,
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
            <OrdersFilter />

            {/* Orders Table */}
            <OrdersTable orders={orders} />

            {/* Order Count */}
            <div className="text-sm text-gray-500">
                Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
