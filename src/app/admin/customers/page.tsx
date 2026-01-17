import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomersTable } from "@/components/admin/CustomersTable";

interface SearchParams {
    search?: string;
}

async function getCustomers(searchParams: SearchParams) {
    try {
        const customers = await prisma.user.findMany({
            where: {
                role: "CUSTOMER",
                ...(searchParams.search && {
                    OR: [
                        {
                            name: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
            },
            include: {
                orders: {
                    select: { total: true, paymentStatus: true },
                },
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Calculate total spent per customer
        const customersWithStats = customers.map((customer) => ({
            ...customer,
            totalSpent: customer.orders
                .filter((o) => o.paymentStatus === "PAID")
                .reduce((sum, o) => sum + o.total, 0),
        }));

        return customersWithStats;
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
}

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const customers = await getCustomers(searchParams);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your customer accounts
                </p>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search customers by name or email..."
                        className="pl-10"
                        defaultValue={searchParams.search}
                        name="search"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <CustomersTable customers={customers} />

            {/* Customer Count */}
            <div className="text-sm text-gray-500">
                Showing {customers.length} customer{customers.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
