/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const year = new Date().getFullYear();

    return `ORD-${year}-${timestamp}${random}`;
}

/**
 * Calculate order totals
 */
export function calculateOrderTotals(items: Array<{ price: number; quantity: number }>, options?: {
    shippingCost?: number;
    taxRate?: number;
    discount?: number;
}) {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = options?.shippingCost || 0;
    const discount = options?.discount || 0;
    const taxRate = options?.taxRate || 0.18; // 18% GST

    const taxableAmount = subtotal + shipping - discount;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax;

    return {
        subtotal,
        shipping,
        discount,
        tax,
        total,
    };
}

/**
 * Validate order data
 */
export function validateOrderData(orderData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!orderData.items || orderData.items.length === 0) {
        errors.push('Order must contain at least one item');
    }

    if (!orderData.shippingAddress) {
        errors.push('Shipping address is required');
    }

    if (!orderData.customerName || orderData.customerName.trim() === '') {
        errors.push('Customer name is required');
    }

    if (!orderData.customerPhone || orderData.customerPhone.trim() === '') {
        errors.push('Customer phone is required');
    }

    if (orderData.total <= 0) {
        errors.push('Order total must be greater than zero');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Format order for email
 */
export function formatOrderForEmail(order: any) {
    return {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        items: order.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        shippingAddress: order.shippingAddress,
    };
}

/**
 * Calculate shipping cost based on order value and location
 */
export function calculateShippingCost(subtotal: number, deliveryMethod?: 'standard' | 'express'): number {
    // Free shipping for orders above ₹999
    if (subtotal >= 999) {
        return 0;
    }

    // Express delivery costs more
    if (deliveryMethod === 'express') {
        return 150;
    }

    // Standard delivery
    return 50;
}

/**
 * Estimate delivery date
 */
export function estimateDeliveryDate(deliveryMethod?: 'standard' | 'express'): string {
    const today = new Date();
    const daysToAdd = deliveryMethod === 'express' ? 3 : 7;

    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);

    return deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
