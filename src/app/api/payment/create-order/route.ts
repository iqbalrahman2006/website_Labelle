import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/utils/order-utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

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

        // Create Razorpay order
        const result = await createRazorpayOrder(amount, receipt);

        if (!result.success || !result.order) {
            return NextResponse.json(
                { error: result.error || 'Failed to create order' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            orderId: result.order.id,
            amount: result.order.amount,
            currency: result.order.currency,
            keyId: getRazorpayKeyId(),
            receipt: result.order.receipt,
        });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
