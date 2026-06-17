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

// GET /api/admin/products - List all products
export async function GET(request: NextRequest) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";

        const products = await prisma.product.findMany({
            where: {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { sku: { contains: search, mode: "insensitive" } },
                    ],
                }),
                ...(status && { status: status as any }),
            },
            include: {
                category: { select: { name: true } },
                images: { take: 1, orderBy: { position: "asc" } },
                _count: { select: { reviews: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// POST /api/admin/products - Create product
export async function POST(request: NextRequest) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();

        const productSchema = z.object({
            name: z.string().min(3),
            slug: z.string().min(3),
            sku: z.string().min(2),
            description: z.string().min(10),
            shortDesc: z.string().optional(),
            categoryId: z.string().min(1),
            price: z.number().min(0),
            compareAtPrice: z.number().optional(),
            costPrice: z.number().optional(),
            inventory: z.number().int().min(0),
            lowStockThreshold: z.number().int().default(10),
            trackInventory: z.boolean().default(true),
            status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]),
            isFeatured: z.boolean().default(false),
            isNewArrival: z.boolean().default(false),
            isBestseller: z.boolean().default(false),
            fabric: z.string().optional(),
            care: z.string().optional(),
            occasion: z.array(z.string()).default([]),
            pattern: z.string().optional(),
            sleeveType: z.string().optional(),
            metaTitle: z.string().optional(),
            metaDesc: z.string().optional(),
            weight: z.number().optional(),
            images: z.array(z.object({
                url: z.string(),
                alt: z.string().optional(),
                position: z.number().default(0),
            })).optional(),
        });

        const validatedData = productSchema.parse(body);

        const product = await prisma.product.create({
            data: {
                ...validatedData,
                images: validatedData.images
                    ? {
                        create: validatedData.images,
                    }
                    : undefined,
            },
            include: {
                category: true,
                images: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
