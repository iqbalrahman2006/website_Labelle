import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ items: [] });
        }

        const cartItems = await prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        images: true,
                    },
                },
            },
        });

        return NextResponse.json(cartItems);
    } catch (error) {
        console.error("CART_GET_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { productId, variantId, quantity } = await req.json();

        const existingItem = await prisma.cartItem.findFirst({
            where: {
                userId: session.user.id,
                productId,
                variantId: variantId || null,
            },
        });

        if (existingItem) {
            const cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + (quantity || 1) },
            });
            return NextResponse.json(cartItem);
        }

        const cartItem = await prisma.cartItem.create({
            data: {
                userId: session.user.id,
                productId,
                variantId: variantId || null,
                quantity: quantity || 1,
            },
        });

        return NextResponse.json(cartItem);
    } catch (error) {
        console.error("CART_POST_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();

        await prisma.cartItem.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Item removed" });
    } catch (error) {
        console.error("CART_DELETE_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
