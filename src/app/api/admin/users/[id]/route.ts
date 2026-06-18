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
        const { role } = await request.json();

        const validRoles = ["USER", "ADMIN", "CUSTOMER", "SUPER_ADMIN"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
