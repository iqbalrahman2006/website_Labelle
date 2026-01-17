export interface CheckoutData {
    shippingAddress: Address;
    billingAddress?: Address;
    deliveryMethod: 'standard' | 'express';
    paymentMethod: 'razorpay' | 'cod';
    couponCode?: string;
}

export interface Address {
    id?: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    landmark?: string;
    addressType?: 'HOME' | 'OFFICE' | 'OTHER';
    isDefault?: boolean;
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    created_at: number;
}

export interface PaymentVerification {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface OrderItem {
    productId: string;
    variantId?: string;
    name: string;
    sku: string;
    size?: string;
    color?: string;
    image?: string;
    quantity: number;
    price: number;
    total: number;
}

export interface CreateOrderData {
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress?: Address;
    deliveryMethod: 'standard' | 'express';
    paymentMethod: 'razorpay' | 'cod';
    couponCode?: string;
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    notes?: string;
}

export interface CheckoutStep {
    id: 'shipping' | 'payment' | 'confirmation';
    title: string;
    description: string;
}

export const CHECKOUT_STEPS: CheckoutStep[] = [
    {
        id: 'shipping',
        title: 'Shipping',
        description: 'Delivery address and method',
    },
    {
        id: 'payment',
        title: 'Payment',
        description: 'Review and pay',
    },
    {
        id: 'confirmation',
        title: 'Confirmation',
        description: 'Order confirmed',
    },
];
