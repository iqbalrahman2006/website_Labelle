"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Variant {
    id: string;
    sku: string;
    size: string | null;
    color: string | null;
    inventory: number;
    product: {
        id: string;
        name: string;
        images: Array<{ url: string }>;
    };
}

interface InventoryTableProps {
    variants: Variant[];
}

export function InventoryTable({ variants: initialVariants }: InventoryTableProps) {
    const [variants, setVariants] = useState<Variant[]>(initialVariants);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [localStocks, setLocalStocks] = useState<Record<string, number>>({});

    const handleStockChange = (variantId: string, val: string) => {
        const parsed = parseInt(val);
        setLocalStocks((prev) => ({
            ...prev,
            [variantId]: isNaN(parsed) ? 0 : parsed,
        }));
    };

    const handleUpdateStock = async (variantId: string) => {
        const stockToUpdate = localStocks[variantId] !== undefined 
            ? localStocks[variantId] 
            : variants.find(v => v.id === variantId)?.inventory || 0;

        setUpdatingId(variantId);
        try {
            const response = await fetch(`/api/admin/variants/${variantId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inventory: stockToUpdate }),
            });

            if (!response.ok) {
                throw new Error("Failed to update stock");
            }

            setVariants((prev) =>
                prev.map((v) =>
                    v.id === variantId ? { ...v, inventory: stockToUpdate } : v
                )
            );
            toast.success("Stock updated successfully");
        } catch (error) {
            console.error("Error updating stock:", error);
            toast.error("Failed to update stock");
        } finally {
            setUpdatingId(null);
        }
    };

    if (variants.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No product variants found
                    </h3>
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
                                Size / Color
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                SKU
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Current Stock
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                                Update Stock
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {variants.map((v) => {
                            const currentLocalStock = localStocks[v.id] !== undefined ? localStocks[v.id] : v.inventory;
                            const hasChanged = currentLocalStock !== v.inventory;
                            const imageUrl = v.product.images[0]?.url || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80";

                            return (
                                <tr
                                    key={v.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={imageUrl}
                                                    alt={v.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-gray-900 line-clamp-1">
                                                {v.product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {v.size || "Free"} / {v.color || "N/A"}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                                        {v.sku}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                            v.inventory === 0
                                                ? "bg-red-100 text-red-800"
                                                : v.inventory <= 5
                                                ? "bg-amber-100 text-amber-800"
                                                : "bg-green-100 text-green-800"
                                        }`}>
                                            {v.inventory} units
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Input
                                                type="number"
                                                className="w-20 text-center"
                                                value={currentLocalStock}
                                                onChange={(e) => handleStockChange(v.id, e.target.value)}
                                                disabled={updatingId === v.id}
                                                min="0"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleUpdateStock(v.id)}
                                                disabled={updatingId === v.id || !hasChanged}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
