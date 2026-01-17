import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

async function getDashboardStats() {
    try {
        const [totalOrders, totalCustomers, totalProducts, revenue, recentOrders] =
            await Promise.all([
                prisma.order.count(),
                prisma.user.count({ where: { role: "CUSTOMER" } }),
                prisma.product.count({ where: { status: "PUBLISHED" } }),
                prisma.order.aggregate({
                    _sum: { total: true },
                    where: { paymentStatus: "PAID" },
                }),
                prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: "desc" },
                    include: {
                        user: { select: { name: true, email: true } },
                        items: true,
                    },
                }),
            ]);

        return {
            totalOrders,
            totalCustomers,
            totalProducts,
            revenue: revenue._sum.total || 0,
            recentOrders,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalOrders: 0,
            totalCustomers: 0,
            totalProducts: 0,
            revenue: 0,
            recentOrders: [],
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    const statCards = [
        {
            title: "Total Revenue",
            value: formatCurrency(stats.revenue),
            icon: DollarSign,
            trend: "+12.5%",
            trendUp: true,
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toString(),
            icon: ShoppingCart,
            trend: "+8.2%",
            trendUp: true,
        },
        {
            title: "Total Customers",
            value: stats.totalCustomers.toString(),
            icon: Users,
            trend: "+5.4%",
            trendUp: true,
        },
        {
            title: "Total Products",
            value: stats.totalProducts.toString(),
            icon: Package,
            trend: "+2.1%",
            trendUp: true,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Overview of your store performance
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-5 w-5 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp
                                        className={`h-4 w-4 ${stat.trendUp
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${stat.trendUp
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {stat.trend}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm">
                                View All
                                <ArrowUpRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {stats.recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No orders yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                            Order Number
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                            Status
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                            Total
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-gray-100 hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-4">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">
                                                {order.customerName}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "DELIVERED"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.status === "SHIPPED"
                                                                ? "bg-purple-100 text-purple-800"
                                                                : order.status === "PROCESSING"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : order.status === "CANCELLED"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/admin/products/new">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Add Product
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Create a new product
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/admin/orders">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Manage Orders
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        View and process orders
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href="/admin/customers">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        View Customers
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Manage customer accounts
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
