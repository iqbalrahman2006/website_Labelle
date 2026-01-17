import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { formatOrderForEmail } from '@/lib/utils/order-utils';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = body;

        // Verify payment signature
        const isValid = verifyRazorpaySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Create order in database
        const order = await prisma.order.create({
            data: {
                orderNumber: orderData.orderNumber,
                userId: session.user.id,
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                paymentMethod: 'RAZORPAY',
                paymentId: razorpay_payment_id,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                tax: orderData.tax,
                discount: orderData.discount || 0,
                total: orderData.total,
                customerName: orderData.customerName,
                customerEmail: orderData.customerEmail,
                customerPhone: orderData.customerPhone,
                shippingAddress: orderData.shippingAddress,
                billingAddress: orderData.billingAddress || orderData.shippingAddress,
                items: {
                    create: orderData.items.map((item: any) => ({
                        productId: item.productId,
                        variantId: item.variantId,
                        name: item.name,
                        sku: item.sku,
                        size: item.size,
                        color: item.color,
                        image: item.image,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        // Clear user's cart
        await prisma.cartItem.deleteMany({
            where: { userId: session.user.id },
        });

        // Send confirmation email
        if (orderData.customerEmail) {
            await sendOrderConfirmationEmail(
                orderData.customerEmail,
                formatOrderForEmail(order)
            );
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
