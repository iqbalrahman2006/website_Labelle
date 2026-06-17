import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils/order-utils';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { amount, currency = 'INR' } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Generate unique receipt ID
        const receipt = generateOrderNumber();

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: 'Payment gateway not configured for local development' },
                { status: 503 }
            );
        }

        // Create Razorpay order
        const result = await createRazorpayOrder(amount, receipt);

        if (!result.success) {
            return NextResponse.json(
                { error: ('error' in result ? result.error : 'Failed to create order') },
                { status: 500 }
            );
        }

        const order = (result as any).order;

        if (!order) {
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: getRazorpayKeyId(),
            receipt: order.receipt,
        });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
