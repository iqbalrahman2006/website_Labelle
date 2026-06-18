import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true } },
                images: { orderBy: { position: "asc" } },
                variants: true,
            },
        });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

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

export default async function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    const [product, categories] = await Promise.all([
        getProduct(params.id),
        getCategories(),
    ]);

    if (!product) {
        notFound();
    }

    // Convert occasion array to comma-separated string
    const initialData = {
        ...product,
        occasion: product.occasion.join(", "),
        categoryId: product.category.id,
        shortDesc: product.shortDesc || undefined,
        compareAtPrice: product.compareAtPrice || undefined,
        costPrice: product.costPrice || undefined,
        fabric: product.fabric || undefined,
        care: product.care || undefined,
        pattern: product.pattern || undefined,
        sleeveType: product.sleeveType || undefined,
        metaTitle: product.metaTitle || undefined,
        metaDesc: product.metaDesc || undefined,
        images: product.images.map((img) => img.url),
        variants: product.variants.map((v) => ({
            size: v.size || "",
            color: v.color || "",
            stock: v.inventory || 0,
            priceAdjustment: v.priceAdjustment || 0,
        })),
    };

    return <ProductForm categories={categories} initialData={initialData} />;
}
