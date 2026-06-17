import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const VALID_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL", "2-3Y", "4-5Y", "6-7Y"];

export async function POST(req: Request) {
    try {
        const session = await auth();
        // ADMIN only authorization check
        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body || !Array.isArray(body)) {
            return NextResponse.json(
                { message: "Invalid payload: Body must be a JSON array of products" },
                { status: 400 }
            );
        }

        if (body.length === 0) {
            return NextResponse.json(
                { message: "Invalid payload: Array is empty" },
                { status: 400 }
            );
        }

        // Set to track slugs in payload for self-duplicate checking
        const payloadSlugs = new Set<string>();

        // Pre-validate all products to avoid partial transaction issues
        for (let i = 0; i < body.length; i++) {
            const product = body[i];
            const rowNum = i + 1;

            if (!product.name || typeof product.name !== "string" || product.name.trim() === "") {
                return NextResponse.json({ message: `Row ${rowNum}: Product name is required` }, { status: 400 });
            }

            const slug = product.slug ? slugify(product.slug) : slugify(product.name);
            if (payloadSlugs.has(slug)) {
                return NextResponse.json({ message: `Duplicate slug detected in upload payload: "${slug}"` }, { status: 400 });
            }
            payloadSlugs.add(slug);
            product.slug = slug; // ensure slug is cleaned and set

            if (!product.description || typeof product.description !== "string" || product.description.trim() === "") {
                return NextResponse.json({ message: `Row ${rowNum} (${product.name}): Description is required` }, { status: 400 });
            }

            if (product.price === undefined || product.price === null || isNaN(Number(product.price)) || Number(product.price) < 0) {
                return NextResponse.json({ message: `Row ${rowNum} (${product.name}): Valid price is required` }, { status: 400 });
            }

            if (!product.categoryName || typeof product.categoryName !== "string" || product.categoryName.trim() === "") {
                return NextResponse.json({ message: `Row ${rowNum} (${product.name}): Category Name is required` }, { status: 400 });
            }

            if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
                return NextResponse.json({ message: `Row ${rowNum} (${product.name}): At least one variant is required` }, { status: 400 });
            }

            // Validate variants
            for (let j = 0; j < product.variants.length; j++) {
                const variant = product.variants[j];
                const variantNum = j + 1;

                if (!variant.size || !VALID_SIZES.includes(variant.size)) {
                    return NextResponse.json({ 
                        message: `Row ${rowNum} (${product.name}) Variant ${variantNum}: Invalid size "${variant.size}". Allowed sizes: ${VALID_SIZES.join(", ")}` 
                    }, { status: 400 });
                }

                if (!variant.color || typeof variant.color !== "string" || variant.color.trim() === "") {
                    return NextResponse.json({ 
                        message: `Row ${rowNum} (${product.name}) Variant ${variantNum}: Color is required` 
                    }, { status: 400 });
                }

                if (variant.stock === undefined || variant.stock === null || isNaN(Number(variant.stock)) || Number(variant.stock) < 0) {
                    return NextResponse.json({ 
                        message: `Row ${rowNum} (${product.name}) Variant ${variantNum}: Stock must be a non-negative integer` 
                    }, { status: 400 });
                }
            }
        }

        // Check for existing database slugs in bulk
        const slugsToCheck = Array.from(payloadSlugs);
        const existingProducts = await prisma.product.findMany({
            where: { slug: { in: slugsToCheck } },
            select: { slug: true }
        });

        if (existingProducts.length > 0) {
            const conflictSlugs = existingProducts.map(p => p.slug).join(", ");
            return NextResponse.json({ 
                message: `Database Conflict: The following slugs are already in use: ${conflictSlugs}` 
            }, { status: 409 });
        }

        // Run the database operations in an atomic transaction
        const result = await prisma.$transaction(async (tx) => {
            const createdProducts = [];

            for (const product of body) {
                // Find or create Category by name
                const categoryNameNormalized = product.categoryName.trim();
                const categorySlug = slugify(categoryNameNormalized);

                let category = await tx.category.findUnique({
                    where: { slug: categorySlug }
                });

                if (!category) {
                    category = await tx.category.create({
                        data: {
                            name: categoryNameNormalized,
                            slug: categorySlug,
                            description: `Auto-created category for ${categoryNameNormalized}`,
                            isActive: true
                        }
                    });
                }

                // Generate SKU for product
                const productSku = `LBL-${product.slug.toUpperCase()}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 100)}`;

                const newProduct = await tx.product.create({
                    data: {
                        name: product.name,
                        slug: product.slug,
                        sku: productSku,
                        description: product.description,
                        shortDesc: product.shortDesc || null,
                        price: parseFloat(product.price),
                        compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : null,
                        categoryId: category.id,
                        fabric: product.fabric || null,
                        care: product.care || null,
                        pattern: product.pattern || null,
                        sleeveType: product.sleeveType || null,
                        status: "PUBLISHED",
                        images: {
                            create: (product.images || []).map((url: string, index: number) => ({
                                url,
                                alt: product.name,
                                position: index
                            }))
                        },
                        variants: {
                            create: product.variants.map((v: any, index: number) => {
                                const variantSku = `LBL-${product.slug.toUpperCase()}-${v.size.toUpperCase()}-${v.color.toUpperCase().replace(/\s+/g, "")}-${index}`;
                                return {
                                    sku: variantSku,
                                    size: v.size,
                                    color: v.color,
                                    inventory: parseInt(v.stock || v.inventory || 0),
                                    priceAdjustment: parseFloat(v.priceAdjustment || 0),
                                    isActive: true
                                };
                            })
                        }
                    },
                    include: {
                        images: true,
                        variants: true,
                        category: true
                    }
                });

                createdProducts.push(newProduct);
            }

            return createdProducts;
        });

        return NextResponse.json({
            success: true,
            message: `Successfully imported ${result.length} products.`,
            productsCount: result.length
        }, { status: 201 });

    } catch (error: any) {
        console.error("BULK_IMPORT_ERROR", error);
        return NextResponse.json(
            { message: "Internal server error during bulk import", error: error.message },
            { status: 500 }
        );
    }
}
