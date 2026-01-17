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
        const body = await req.json();
        const { isDefault, ...rest } = body;

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.update({
            where: { id, userId: session.user.id },
            data: { isDefault, ...rest },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("ADDRESS_PATCH_ERROR", error);
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

        await prisma.address.delete({
            where: { id, userId: session.user.id },
        });

        return NextResponse.json({ message: "Address deleted" });
    } catch (error) {
        console.error("ADDRESS_DELETE_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
