import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ message: "Product ID required" }, { status: 400 });
        }

        const reviews = await prisma.review.findMany({
            where: {
                productId,
                status: "APPROVED",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("REVIEWS_GET_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId, rating, title, comment, images } = await req.json();

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                productId,
                rating,
                title,
                comment,
                images: images || [],
            },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("REVIEW_POST_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
