import { prisma } from "@/lib/prisma";
import { CategoriesTable } from "@/components/admin/CategoriesTable";

async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: { select: { name: true } },
                _count: { select: { products: true } },
            },
            orderBy: { displayOrder: "asc" },
        });
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage product categories
                </p>
            </div>

            <CategoriesTable categories={categories} />

            <div className="text-sm text-gray-500">
                Showing {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </div>
        </div>
    );
}
