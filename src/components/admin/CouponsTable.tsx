"use client";

import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface Coupon {
    id: string;
    code: string;
    type: string;
    value: number;
    minOrderValue: number | null;
    usageLimit: number | null;
    usedCount: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

interface CouponsTableProps {
    coupons: Coupon[];
}

export function CouponsTable({ coupons }: CouponsTableProps) {
    if (coupons.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No coupons found</p>
            </div>
        );
    }

    const isExpired = (endDate: Date) => new Date(endDate) < new Date();

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Code
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Type
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Value
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Min Order
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Usage
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Valid Until
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {coupon.code}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {coupon.type}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {coupon.type === "PERCENTAGE"
                                        ? `${coupon.value}%`
                                        : formatCurrency(coupon.value)}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {coupon.minOrderValue
                                        ? formatCurrency(coupon.minOrderValue)
                                        : "-"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {coupon.usedCount}
                                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {format(new Date(coupon.endDate), "MMM dd, yyyy")}
                                </td>
                                <td className="py-3 px-4">
                                    {isExpired(coupon.endDate) ? (
                                        <StatusBadge status="ARCHIVED" />
                                    ) : coupon.isActive ? (
                                        <StatusBadge status="PUBLISHED" />
                                    ) : (
                                        <StatusBadge status="DRAFT" />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
