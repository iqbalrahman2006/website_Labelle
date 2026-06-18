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
            shortDesc: z.string().optional().nullable(),
            categoryId: z.string().optional(),
            price: z.number().min(0).optional(),
            compareAtPrice: z.number().optional().nullable(),
            costPrice: z.number().optional().nullable(),
            inventory: z.number().int().min(0).optional(),
            status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]).optional(),
            isFeatured: z.boolean().optional(),
            isNewArrival: z.boolean().optional(),
            isBestseller: z.boolean().optional(),
            fabric: z.string().optional().nullable(),
            care: z.string().optional().nullable(),
            occasion: z.array(z.string()).optional(),
            pattern: z.string().optional().nullable(),
            sleeveType: z.string().optional().nullable(),
            metaTitle: z.string().optional().nullable(),
            metaDesc: z.string().optional().nullable(),
            images: z.array(z.string()).optional(),
            variants: z.array(z.object({
                size: z.string(),
                color: z.string(),
                stock: z.number(),
                priceAdjustment: z.number(),
            })).optional(),
        });

        const validatedData = updateSchema.parse(body);

        // Separate images and variants from validated data
        const { images, variants, ...productUpdateData } = validatedData;

        const updatedProduct = await prisma.$transaction(async (tx) => {
            // Update basic product details
            const product = await tx.product.update({
                where: { id: params.id },
                data: productUpdateData,
            });

            // Update images if provided
            if (images) {
                await tx.productImage.deleteMany({
                    where: { productId: params.id },
                });

                await tx.productImage.createMany({
                    data: images.map((url, index) => ({
                        productId: params.id,
                        url,
                        alt: product.name,
                        position: index,
                    })),
                });
            }

            // Update variants if provided
            if (variants) {
                await tx.productVariant.deleteMany({
                    where: { productId: params.id },
                });

                await tx.productVariant.createMany({
                    data: variants.map((v, index) => {
                        const variantSku = `LBL-${product.slug.toUpperCase()}-${v.size.toUpperCase()}-${v.color.toUpperCase().replace(/\s+/g, "")}-${index}-${Math.floor(Math.random() * 1000)}`;
                        return {
                            productId: params.id,
                            sku: variantSku,
                            size: v.size,
                            color: v.color,
                            inventory: v.stock,
                            priceAdjustment: v.priceAdjustment,
                            isActive: true,
                        };
                    }),
                });
            }

            return tx.product.findUnique({
                where: { id: params.id },
                include: {
                    category: true,
                    images: { orderBy: { position: "asc" } },
                    variants: true,
                },
            });
        });

        return NextResponse.json(updatedProduct);
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
