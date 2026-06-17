import { Resend } from 'resend';

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
    to: string,
    orderData: {
        orderNumber: string;
        customerName: string;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
            total: number;
        }>;
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        shippingAddress: any;
    }
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Email] RESEND_API_KEY not configured. Order confirmation email skipped for:', to);
        return { success: true, skipped: true };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'orders@labelle.com',
            to,
            subject: `Order Confirmation - ${orderData.orderNumber}`,
            html: generateOrderConfirmationHTML(orderData),
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
    to: string,
    orderData: {
        orderNumber: string;
        customerName: string;
        trackingNumber: string;
        carrier: string;
        estimatedDelivery?: string;
    }
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Email] RESEND_API_KEY not configured. Shipping notification email skipped for:', to);
        return { success: true, skipped: true };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'orders@labelle.com',
            to,
            subject: `Your order ${orderData.orderNumber} has been shipped!`,
            html: generateShippingNotificationHTML(orderData),
        });

        if (error) {
            console.error('Email sending error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send email',
        };
    }
}

/**
 * Generate order confirmation email HTML
 */
function generateOrderConfirmationHTML(orderData: any): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { border-bottom: 1px solid #e5e7eb; padding: 15px 0; }
        .item:last-child { border-bottom: none; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order, ${orderData.customerName}</p>
        </div>
        
        <div class="content">
            <p>Your order <strong>${orderData.orderNumber}</strong> has been confirmed and is being processed.</p>
            
            <div class="order-details">
                <h2>Order Details</h2>
                ${orderData.items.map((item: any) => `
                    <div class="item">
                        <div style="display: flex; justify-content: space-between;">
                            <div>
                                <strong>${item.name}</strong><br>
                                <span style="color: #6b7280;">Quantity: ${item.quantity}</span>
                            </div>
                            <div style="text-align: right;">
                                ₹${item.total.toFixed(2)}
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                        <span>Subtotal:</span>
                        <span>₹${orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                        <span>Shipping:</span>
                        <span>₹${orderData.shipping.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                        <span>Tax:</span>
                        <span>₹${orderData.tax.toFixed(2)}</span>
                    </div>
                    <div class="total" style="display: flex; justify-content: space-between;">
                        <span>Total:</span>
                        <span>₹${orderData.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <div class="order-details">
                <h3>Shipping Address</h3>
                <p>
                    ${orderData.shippingAddress.name}<br>
                    ${orderData.shippingAddress.addressLine1}<br>
                    ${orderData.shippingAddress.addressLine2 ? orderData.shippingAddress.addressLine2 + '<br>' : ''}
                    ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} - ${orderData.shippingAddress.pincode}<br>
                    ${orderData.shippingAddress.phone}
                </p>
            </div>
            
            <div style="text-align: center;">
                <a href="${appUrl}/account/orders/${orderData.orderNumber}" class="button">View Order Details</a>
            </div>
        </div>
        
        <div class="footer">
            <p>If you have any questions, please contact us at orders@labelle.com</p>
            <p>&copy; ${new Date().getFullYear()} LA BELLE INDIAN FASHIONS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Generate shipping notification email HTML
 */
function generateShippingNotificationHTML(orderData: any): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipped</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; }
        .tracking-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Your Order is On Its Way!</h1>
            <p>Hi ${orderData.customerName},</p>
        </div>
        
        <div class="content">
            <p>Great news! Your order <strong>${orderData.orderNumber}</strong> has been shipped and is on its way to you.</p>
            
            <div class="tracking-box">
                <h3>Tracking Information</h3>
                <p><strong>Carrier:</strong> ${orderData.carrier}</p>
                <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
                ${orderData.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${orderData.estimatedDelivery}</p>` : ''}
            </div>
            
            <div style="text-align: center;">
                <a href="${appUrl}/account/orders/${orderData.orderNumber}" class="button">Track Your Order</a>
            </div>
        </div>
        
        <div class="footer">
            <p>If you have any questions, please contact us at orders@labelle.com</p>
            <p>&copy; ${new Date().getFullYear()} LA BELLE INDIAN FASHIONS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}
