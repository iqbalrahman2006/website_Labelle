import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Check admin authorization
async function checkAdmin() {
    const session = await auth();
    if (!session?.user) return false;

    // @ts-ignore - role is added via session callback
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
        return false;
    }
    return true;
}

// PATCH /api/admin/orders/[id] - Update order status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const updateSchema = z.object({
            status: z
                .enum([
                    "PENDING",
                    "CONFIRMED",
                    "PROCESSING",
                    "PACKED",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                    "RETURNED",
                    "REFUNDED",
                ])
                .optional(),
            trackingNumber: z.string().optional(),
            carrier: z.string().optional(),
        });

        const validatedData = updateSchema.parse(body);

        const updateData: any = { ...validatedData };

        // Set timestamps based on status
        if (validatedData.status === "SHIPPED" && !updateData.shippedAt) {
            updateData.shippedAt = new Date();
        }
        if (validatedData.status === "DELIVERED" && !updateData.deliveredAt) {
            updateData.deliveredAt = new Date();
        }

        const order = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
            include: {
                user: { select: { name: true, email: true } },
                items: {
                    include: {
                        product: { select: { name: true } },
                    },
                },
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Validation error", details: error.issues },
                { status: 400 }
            );
        }
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}
