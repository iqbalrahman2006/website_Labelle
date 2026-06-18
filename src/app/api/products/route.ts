export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const featured = searchParams.get("isFeatured") || searchParams.get("featured");
        const newArrival = searchParams.get("isNewArrival");
        const bestseller = searchParams.get("isBestseller");
        const search = searchParams.get("search");

        // Advanced filters
        const sizes = searchParams.getAll("sizes");
        const colors = searchParams.getAll("colors");
        const occasions = searchParams.getAll("occasions");
        const minPriceStr = searchParams.get("minPrice");
        const maxPriceStr = searchParams.get("maxPrice");
        const sortBy = searchParams.get("sortBy") || "newest";

        const where: any = {};
        if (category) {
            where.category = {
                OR: [
                    { id: category },
                    { slug: category }
                ]
            };
        }
        if (featured) where.isFeatured = featured === "true";
        if (newArrival) where.isNewArrival = newArrival === "true";
        if (bestseller) where.isBestseller = bestseller === "true";
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        // Price boundaries filter
        if (minPriceStr || maxPriceStr) {
            const priceFilter: any = {};
            if (minPriceStr) priceFilter.gte = parseFloat(minPriceStr);
            if (maxPriceStr) priceFilter.lte = parseFloat(maxPriceStr);
            where.price = priceFilter;
        }

        // Variant filters
        if (sizes.length > 0 || colors.length > 0) {
            const variantFilter: any = { isActive: true };
            if (sizes.length > 0) {
                variantFilter.size = { in: sizes };
            }
            if (colors.length > 0) {
                variantFilter.color = { in: colors, mode: "insensitive" };
            }
            where.variants = {
                some: variantFilter
            };
        }

        // Occasions list filter
        if (occasions.length > 0) {
            where.occasion = {
                hasSome: occasions
            };
        }

        // Sorting query builder
        let orderBy: any = { createdAt: "desc" };
        if (sortBy === "price-asc") {
            orderBy = { price: "asc" };
        } else if (sortBy === "price-desc") {
            orderBy = { price: "desc" };
        } else if (sortBy === "rating") {
            orderBy = { averageRating: "desc" };
        } else if (sortBy === "popularity") {
            orderBy = { reviewCount: "desc" };
        }

        const total = await prisma.product.count({ where });

        const products = await prisma.product.findMany({
            where,
            include: {
                images: true,
                category: true,
                variants: true,
            },
            orderBy,
        });

        return NextResponse.json({
            products,
            total,
            page: 1,
            pageSize: products.length,
            totalPages: 1
        });
    } catch (error) {
        console.error("PRODUCTS_GET_ERROR", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        // ADMIN only authorization check
        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            slug,
            description,
            price,
            compareAtPrice,
            categoryId,
            fabric,
            care,
            pattern,
            sleeveType,
            isFeatured,
            isNewArrival,
            isBestseller,
            images,
            variants,
        } = body;

        // Validation checks
        if (!name || !slug || price === undefined || price === null || !categoryId || !variants || !Array.isArray(variants) || variants.length === 0) {
            return NextResponse.json(
                { message: "Missing required fields: name, slug, price, categoryId, and at least 1 variant are required" },
                { status: 400 }
            );
        }

        // Check for duplicate slug
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });

        if (existingProduct) {
            return NextResponse.json(
                { message: "Slug already in use" },
                { status: 409 }
            );
        }

        // Create product and variants inside atomic transaction
        const product = await prisma.$transaction(async (tx) => {
            const productSku = `LBL-${slug.toUpperCase()}-${Date.now().toString().slice(-4)}`;

            return await tx.product.create({
                data: {
                    name,
                    slug,
                    sku: productSku,
                    description,
                    price: parseFloat(price),
                    compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                    categoryId,
                    fabric: fabric || null,
                    care: care || null,
                    pattern: pattern || null,
                    sleeveType: sleeveType || null,
                    isFeatured: !!isFeatured,
                    isNewArrival: !!isNewArrival,
                    isBestseller: !!isBestseller,
                    status: "PUBLISHED",
                    images: {
                        create: (images || []).map((url: string, index: number) => ({
                            url,
                            alt: name,
                            position: index,
                        })),
                    },
                    variants: {
                        create: variants.map((v: any, index: number) => {
                            const variantSku = `LBL-${slug.toUpperCase()}-${v.size.toUpperCase()}-${v.color.toUpperCase().replace(/\s+/g, "")}-${index}`;
                            return {
                                sku: variantSku,
                                size: v.size,
                                color: v.color,
                                inventory: parseInt(v.stock || v.inventory || 0),
                                priceAdjustment: parseFloat(v.priceAdjustment || 0),
                                isActive: true,
                            };
                        }),
                    },
                },
                include: {
                    images: true,
                    variants: true,
                    category: true,
                },
            });
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("PRODUCT_POST_ERROR", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
