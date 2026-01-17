import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(amount: number, receipt: string) {
    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt,
            payment_capture: 1, // Auto capture payment
        });

        return {
            success: true,
            order,
        };
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create order',
        };
    }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    try {
        const text = `${orderId}|${paymentId}`;
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(text)
            .digest('hex');

        return generatedSignature === signature;
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
    webhookBody: string,
    webhookSignature: string,
    webhookSecret: string
): boolean {
    try {
        const generatedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(webhookBody)
            .digest('hex');

        return generatedSignature === webhookSignature;
    } catch (error) {
        console.error('Webhook signature verification error:', error);
        return false;
    }
}

/**
 * Format amount for Razorpay (convert to paise)
 */
export function formatAmountForRazorpay(amount: number): number {
    return Math.round(amount * 100);
}

/**
 * Format amount from Razorpay (convert from paise)
 */
export function formatAmountFromRazorpay(amount: number): number {
    return amount / 100;
}

/**
 * Get Razorpay public key for client-side
 */
export function getRazorpayKeyId(): string {
    return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
}
