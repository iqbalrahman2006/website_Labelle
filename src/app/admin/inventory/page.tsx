import { prisma } from "@/lib/prisma";
import { InventoryTable } from "@/components/admin/InventoryTable";

interface SearchParams {
    search?: string;
}

async function getVariants(searchParams: SearchParams) {
    try {
        const variants = await prisma.productVariant.findMany({
            where: {
                ...(searchParams.search && {
                    OR: [
                        {
                            sku: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            product: {
                                name: {
                                    contains: searchParams.search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                }),
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        images: {
                            take: 1,
                            orderBy: { position: "asc" },
                        },
                    },
                },
            },
            orderBy: { sku: "asc" },
        });

        return variants;
    } catch (error) {
        console.error("Error fetching variants:", error);
        return [];
    }
}

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const variants = await getVariants(searchParams);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventory Stock Levels</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage and update individual product variant stock counts
                </p>
            </div>

            {/* Inventory Table */}
            <InventoryTable variants={variants} />

            {/* Variant Count */}
            <div className="text-sm text-gray-500">
                Showing {variants.length} variant{variants.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
