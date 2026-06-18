import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
    const session = await auth();
    if (!session?.user) return false;
    // @ts-ignore
    return session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { id } = params;
        const { inventory } = await request.json();

        if (inventory === undefined || inventory === null || typeof inventory !== "number") {
            return NextResponse.json({ error: "Invalid inventory value" }, { status: 400 });
        }

        const variant = await prisma.productVariant.update({
            where: { id },
            data: { inventory: Math.max(0, inventory) },
        });

        // Recalculate parent product total inventory
        const siblingVariants = await prisma.productVariant.findMany({
            where: { productId: variant.productId },
        });

        const totalInventory = siblingVariants.reduce((sum, v) => sum + v.inventory, 0);

        await prisma.product.update({
            where: { id: variant.productId },
            data: { inventory: totalInventory },
        });

        return NextResponse.json({ success: true, variant });
    } catch (error) {
        console.error("Error updating variant inventory:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
