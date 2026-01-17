import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json([]);
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        images: true,
                    },
                },
            },
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error("WISHLIST_GET_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        const wishlistItem = await prisma.wishlist.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            update: {}, // Do nothing if already exists
            create: {
                userId: session.user.id,
                productId,
            },
        });

        return NextResponse.json(wishlistItem);
    } catch (error) {
        console.error("WISHLIST_POST_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error("WISHLIST_DELETE_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
