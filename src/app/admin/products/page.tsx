import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductsTable } from "@/components/admin/ProductsTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SearchParams {
    search?: string;
    status?: string;
}

async function getProducts(searchParams: SearchParams) {
    try {
        const products = await prisma.product.findMany({
            where: {
                ...(searchParams.search && {
                    OR: [
                        {
                            name: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            sku: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
                ...(searchParams.status && { status: searchParams.status as any }),
            },
            include: {
                category: { select: { name: true } },
                images: { take: 1, orderBy: { position: "asc" } },
                _count: { select: { reviews: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const products = await getProducts(searchParams);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your product catalog
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/products/import">
                        <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Import CSV
                        </Button>
                    </Link>
                    <Link href="/admin/products/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>


            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products by name or SKU..."
                        className="pl-10"
                        defaultValue={searchParams.search}
                        name="search"
                    />
                </div>
                <Select defaultValue={searchParams.status || "all"}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                        <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Products Table */}
            <ProductsTable products={products} />

            {/* Product Count */}
            <div className="text-sm text-gray-500">
                Showing {products.length} product{products.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
