"use client";

import { StatusBadge } from "./StatusBadge";

interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    parent: { name: string } | null;
    _count: { products: number };
}

interface CategoriesTableProps {
    categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
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
                                Slug
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Parent
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Products
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {category.slug}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {category.parent?.name || "-"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {category._count.products}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge
                                        status={category.isActive ? "PUBLISHED" : "ARCHIVED"}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
