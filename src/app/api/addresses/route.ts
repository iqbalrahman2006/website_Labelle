import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json([]);
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { isDefault: "desc" },
        });

        return NextResponse.json(addresses);
    } catch (error) {
        console.error("ADDRESSES_GET_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            landmark,
            addressType,
            isDefault,
        } = body;

        if (isDefault) {
            // Set all other addresses of the user to not default
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: session.user.id,
                name,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
                landmark,
                addressType,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("ADDRESS_POST_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
