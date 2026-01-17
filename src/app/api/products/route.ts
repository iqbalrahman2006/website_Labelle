import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");
        const search = searchParams.get("search");

        const where: any = {};
        if (category) where.categoryId = category;
        if (featured) where.isFeatured = featured === "true";
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                images: true,
                category: true,
                variants: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);
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
        // @ts-ignore
        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            slug,
            sku,
            description,
            shortDesc,
            price,
            categoryId,
            inventory,
            images,
        } = body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                sku,
                description,
                shortDesc,
                price,
                categoryId,
                inventory,
                images: {
                    createMany: {
                        data: images.map((image: any) => ({
                            url: image.url,
                            alt: image.alt || name,
                        })),
                    },
                },
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("PRODUCT_POST_ERROR", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
