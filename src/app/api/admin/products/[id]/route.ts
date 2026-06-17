import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Check admin authorization
async function checkAdmin() {
    const session = await auth();
    if (!session?.user) return false;

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
        return false;
    }
    return true;
}

// GET /api/admin/products/[id] - Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                images: { orderBy: { position: "asc" } },
                variants: true,
                _count: { select: { reviews: true } },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/products/[id] - Update product
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();

        const updateSchema = z.object({
            name: z.string().min(3).optional(),
            slug: z.string().min(3).optional(),
            description: z.string().min(10).optional(),
            shortDesc: z.string().optional(),
            categoryId: z.string().optional(),
            price: z.number().min(0).optional(),
            compareAtPrice: z.number().optional(),
            costPrice: z.number().optional(),
            inventory: z.number().int().min(0).optional(),
            status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]).optional(),
            isFeatured: z.boolean().optional(),
            isNewArrival: z.boolean().optional(),
            isBestseller: z.boolean().optional(),
            fabric: z.string().optional(),
            care: z.string().optional(),
            occasion: z.array(z.string()).optional(),
            pattern: z.string().optional(),
            sleeveType: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDesc: z.string().optional(),
        });

        const validatedData = updateSchema.parse(body);

        const product = await prisma.product.update({
            where: { id: params.id },
            data: validatedData,
            include: {
                category: true,
                images: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        await prisma.product.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
