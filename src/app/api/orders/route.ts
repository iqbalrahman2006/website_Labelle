import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("ORDERS_GET_ERROR", error);
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
            orderNumber,
            items,
            subtotal,
            shipping,
            tax,
            discount = 0,
            total,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            billingAddress,
            paymentMethod = 'COD',
            deliveryMethod = 'standard',
        } = body;

        // Use provided order number or generate one
        const finalOrderNumber = orderNumber || `LB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const order = await prisma.order.create({
            data: {
                orderNumber: finalOrderNumber,
                userId: session.user.id,
                status: 'CONFIRMED',
                paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
                paymentMethod,
                subtotal,
                shipping,
                tax,
                discount,
                total,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                billingAddress: billingAddress || shippingAddress,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        name: item.name,
                        sku: item.sku,
                        price: item.price,
                        quantity: item.quantity,
                        total: item.total,
                        image: item.image,
                        size: item.size,
                        color: item.color,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Clear cart after order creation
        await prisma.cartItem.deleteMany({
            where: { userId: session.user.id },
        });

        // Send confirmation email
        if (customerEmail) {
            try {
                const { sendOrderConfirmationEmail } = await import('@/lib/email');
                const { formatOrderForEmail } = await import('@/lib/utils/order-utils');
                await sendOrderConfirmationEmail(customerEmail, formatOrderForEmail(order));
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
                // Don't fail the order if email fails
            }
        }

        return NextResponse.json({ success: true, orderNumber: finalOrderNumber, orderId: order.id }, { status: 201 });
    } catch (error) {
        console.error("ORDER_POST_ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

