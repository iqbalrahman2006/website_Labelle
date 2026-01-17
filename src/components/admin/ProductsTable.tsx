"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { DeleteProductButton } from "./DeleteProductButton";
import { StatusBadge } from "./StatusBadge";

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    inventory: number;
    status: string;
    category: { name: string };
    images: { url: string; alt?: string | null }[];
    _count: { reviews: number };
}

interface ProductsTableProps {
    products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
    if (products.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No products found
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Get started by creating your first product
                    </p>
                    <Link href="/admin/products/new">
                        <Button>Add Product</Button>
                    </Link>
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
                                Product
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                SKU
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Category
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Price
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Inventory
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Status
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {product.images[0] ? (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={
                                                        product.images[0].alt ||
                                                        product.name
                                                    }
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Eye className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {product._count.reviews} reviews
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {product.sku}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {product.category.name}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`text-sm font-medium ${product.inventory === 0
                                                ? "text-red-600"
                                                : product.inventory < 10
                                                    ? "text-yellow-600"
                                                    : "text-gray-900"
                                            }`}
                                    >
                                        {product.inventory}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={product.status} />
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/products/${product.id}`}
                                            target="_blank"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="View Product"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                title="Edit Product"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeleteProductButton
                                            productId={product.id}
                                            productName={product.name}
                                        />
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
