import { prisma } from "@/lib/prisma";
import { NewProductForm } from "@/components/admin/NewProductForm";

async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        });
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

export default async function NewProductPage() {
    const categories = await getCategories();

    return <NewProductForm categories={categories} />;
}

