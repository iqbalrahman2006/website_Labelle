"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface Customer {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    createdAt: Date;
    _count: { orders: number };
    totalSpent: number;
}

interface CustomersTableProps {
    customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
    if (customers.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No customers found
                    </h3>
                    <p className="text-sm text-gray-500">
                        Customers will appear here once they register
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
                                Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Email
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Phone
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Orders
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Total Spent
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Joined
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {customer.name || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {customer.email || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {customer.phone || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {customer._count.orders}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {formatCurrency(customer.totalSpent)}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {format(new Date(customer.createdAt), "MMM dd, yyyy")}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-end">
                                        <Link href={`/admin/customers/${customer.id}`}>
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
