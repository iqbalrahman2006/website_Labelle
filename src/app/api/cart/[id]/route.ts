import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const { quantity } = await req.json();

        if (quantity < 1) {
            await prisma.cartItem.delete({
                where: { id, userId: session.user.id },
            });
            return NextResponse.json({ message: "Item removed" });
        }

        const cartItem = await prisma.cartItem.update({
            where: { id, userId: session.user.id },
            data: { quantity },
        });

        return NextResponse.json(cartItem);
    } catch (error) {
        console.error("CART_ITEM_PATCH_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        await prisma.cartItem.delete({
            where: { id, userId: session.user.id },
        });

        return NextResponse.json({ message: "Item removed" });
    } catch (error) {
        console.error("CART_ITEM_DELETE_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
