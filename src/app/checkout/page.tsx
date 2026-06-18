"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { ShippingStep } from "@/components/checkout/ShippingStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSummaryWidget } from "@/components/checkout/OrderSummaryWidget";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Address, CreateOrderData } from "@/types/checkout.types";
import { calculateOrderTotals, generateOrderNumber, calculateShippingCost } from "@/lib/utils/order-utils";

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { items, subtotal, clearCart } = useCart();

    const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
    const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    const [isProcessing, setIsProcessing] = useState(false);

    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        // Redirect if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login?redirect=/checkout');
        }

        // Redirect if cart is empty
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [status, items.length, router]);

    useEffect(() => {
        // Fetch addresses from API
        async function fetchAddresses() {
            try {
                const res = await fetch("/api/addresses");
                if (res.ok) {
                    const data = await res.json();
                    setAddresses(data);
                    // Pre-select default address or first address
                    const defaultAddress = data.find((a: Address) => a.isDefault);
                    if (defaultAddress) {
                        setSelectedAddress(defaultAddress);
                    } else if (data.length > 0) {
                        setSelectedAddress(data[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching addresses:", err);
            }
        }
        if (status === 'authenticated') {
            fetchAddresses();
        }
    }, [status]);

    const handleAddressAdded = (newAddress: Address) => {
        setAddresses((prev) => [...prev, newAddress]);
        setSelectedAddress(newAddress);
    };

    if (status === 'loading' || items.length === 0) {
        return (
            <div className="container py-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const shippingCost = calculateShippingCost(subtotal(), deliveryMethod);
    const totals = calculateOrderTotals(
        items.map(item => ({
            price: item.product.price + (item.variant?.priceAdjustment || 0),
            quantity: item.quantity,
        })),
        {
            shippingCost,
            taxRate: 0.18,
        }
    );

    const handleContinueToPayment = () => {
        if (!selectedAddress) {
            toast.error('Please select a shipping address');
            return;
        }
        setCurrentStep('payment');
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress || !session?.user) {
            toast.error('Missing required information');
            return;
        }

        setIsProcessing(true);

        try {
            const orderNumber = generateOrderNumber();
            const orderData: CreateOrderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    name: item.product.name,
                    sku: (item.product as any).sku || '',
                    size: item.variant?.size,
                    color: item.variant?.color,
                    image: item.product.image,
                    quantity: item.quantity,
                    price: item.product.price + (item.variant?.priceAdjustment || 0),
                    total: (item.product.price + (item.variant?.priceAdjustment || 0)) * item.quantity,
                })),
                shippingAddress: selectedAddress,
                billingAddress: selectedAddress,
                deliveryMethod,
                paymentMethod,
                subtotal: totals.subtotal,
                shipping: totals.shipping,
                tax: totals.tax,
                discount: totals.discount,
                total: totals.total,
                customerName: session.user.name || '',
                customerEmail: session.user.email || '',
                customerPhone: selectedAddress.phone,
            };

            if (paymentMethod === 'razorpay') {
                // Create Razorpay order
                const response = await fetch('/api/payment/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: totals.total,
                        currency: 'INR',
                    }),
                });

                const { orderId, keyId } = await response.json();

                // Open Razorpay checkout
                const options = {
                    key: keyId,
                    amount: totals.total * 100,
                    currency: 'INR',
                    name: 'LA BELLE INDIAN FASHIONS',
                    description: `Order ${orderNumber}`,
                    order_id: orderId,
                    handler: async function (response: any) {
                        // Verify payment
                        const verifyResponse = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                orderData: { ...orderData, orderNumber },
                            }),
                        });

                        const result = await verifyResponse.json();

                        if (result.success) {
                            clearCart();
                            toast.success('Order placed successfully!');
                            router.push(`/order-confirmation/${result.orderNumber}`);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: session.user.name,
                        email: session.user.email,
                        contact: selectedAddress.phone,
                    },
                    theme: {
                        color: '#8B1A4A',
                    },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            } else {
                // COD order - create directly
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...orderData, orderNumber }),
                });

                const result = await response.json();

                if (result.success) {
                    clearCart();
                    toast.success('Order placed successfully!');
                    router.push(`/order-confirmation/${result.orderNumber}`);
                } else {
                    toast.error('Failed to place order');
                }
            }
        } catch (error) {
            console.error('Order placement error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Load Razorpay script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            <CheckoutLayout currentStep={currentStep}>
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                    <div>
                        {currentStep === 'shipping' && (
                            <ShippingStep
                                addresses={addresses}
                                selectedAddress={selectedAddress}
                                deliveryMethod={deliveryMethod}
                                onAddressSelect={setSelectedAddress}
                                onDeliveryMethodChange={setDeliveryMethod}
                                onContinue={handleContinueToPayment}
                                onAddressAdded={handleAddressAdded}
                            />
                        )}

                        {currentStep === 'payment' && selectedAddress && (
                            <PaymentStep
                                shippingAddress={selectedAddress}
                                paymentMethod={paymentMethod}
                                onPaymentMethodChange={setPaymentMethod}
                                onPlaceOrder={handlePlaceOrder}
                                isProcessing={isProcessing}
                            />
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <OrderSummaryWidget
                            items={items.map(item => ({
                                id: item.id,
                                name: item.product.name,
                                image: item.product.image,
                                quantity: item.quantity,
                                price: item.product.price + (item.variant?.priceAdjustment || 0),
                                total: (item.product.price + (item.variant?.priceAdjustment || 0)) * item.quantity,
                            }))}
                            subtotal={totals.subtotal}
                            shipping={totals.shipping}
                            tax={totals.tax}
                            discount={totals.discount}
                            total={totals.total}
                            editable={currentStep === 'shipping'}
                        />
                    </div>
                </div>
            </CheckoutLayout>
        </>
    );
}
