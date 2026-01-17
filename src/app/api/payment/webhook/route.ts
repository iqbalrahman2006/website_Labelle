import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
        const isValid = verifyWebhookSignature(body, signature, webhookSecret);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);

        // Handle different webhook events
        switch (event.event) {
            case 'payment.captured':
                await handlePaymentCaptured(event.payload.payment.entity);
                break;

            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity);
                break;

            case 'order.paid':
                await handleOrderPaid(event.payload.order.entity);
                break;

            default:
                console.log('Unhandled webhook event:', event.event);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function handlePaymentCaptured(payment: any) {
    try {
        // Update order payment status
        await prisma.order.updateMany({
            where: { paymentId: payment.id },
            data: {
                paymentStatus: 'PAID',
                status: 'CONFIRMED',
            },
        });

        console.log('Payment captured:', payment.id);
    } catch (error) {
        console.error('Error handling payment captured:', error);
    }
}

async function handlePaymentFailed(payment: any) {
    try {
        // Update order payment status
        await prisma.order.updateMany({
            where: { paymentId: payment.id },
            data: {
                paymentStatus: 'FAILED',
                status: 'CANCELLED',
            },
        });

        console.log('Payment failed:', payment.id);
    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}

async function handleOrderPaid(order: any) {
    try {
        console.log('Order paid:', order.id);
        // Additional logic if needed
    } catch (error) {
        console.error('Error handling order paid:', error);
    }
}
