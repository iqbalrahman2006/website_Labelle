import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function checkAdmin() {
    const session = await auth();
    if (!session?.user) return false;

    // @ts-ignore - role is added via session callback
    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
        return false;
    }
    return true;
}

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

        const schema = z.object({
            status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
        });

        const { status } = schema.parse(body);

        const review = await prisma.review.update({
            where: { id: params.id },
            data: { status },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}
