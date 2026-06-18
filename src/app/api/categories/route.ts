export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                children: true,
            },
            orderBy: { displayOrder: "asc" },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("CATEGORIES_GET_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "SUPER_ADMIN")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, slug, description, image, parentId } = await req.json();

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
                parentId,
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error("CATEGORY_POST_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
