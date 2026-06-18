"use client";

import { useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Address } from "@/types/checkout.types";

interface PaymentStepProps {
    shippingAddress: Address;
    billingAddress?: Address;
    paymentMethod: 'razorpay' | 'cod';
    onPaymentMethodChange: (method: 'razorpay' | 'cod') => void;
    onPlaceOrder: () => void;
    isProcessing?: boolean;
}

export function PaymentStep({
    shippingAddress,
    billingAddress,
    paymentMethod,
    onPaymentMethodChange,
    onPlaceOrder,
    isProcessing = false,
}: PaymentStepProps) {
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [couponCode, setCouponCode] = useState("");

    return (
        <div className="space-y-8">
                {/* Payment Method */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                    <RadioGroup value={paymentMethod} onValueChange={(value: any) => onPaymentMethodChange(value)}>
                        <Card
                            className={cn(
                                "cursor-pointer transition-all",
                                paymentMethod === 'razorpay' && "border-primary ring-2 ring-primary/20"
                            )}
                            onClick={() => onPaymentMethodChange('razorpay')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <RadioGroupItem value="razorpay" id="razorpay" />
                                    <div className="flex-1">
                                        <Label htmlFor="razorpay" className="cursor-pointer">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CreditCard className="h-5 w-5" />
                                                <span className="font-semibold">Online Payment</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets
                                            </p>
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className={cn(
                                "cursor-pointer transition-all",
                                paymentMethod === 'cod' && "border-primary ring-2 ring-primary/20"
                            )}
                            onClick={() => onPaymentMethodChange('cod')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <div className="flex-1">
                                        <Label htmlFor="cod" className="cursor-pointer">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Wallet className="h-5 w-5" />
                                                <span className="font-semibold">Cash on Delivery</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Pay when you receive your order
                                            </p>
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </RadioGroup>
                </div>

                {/* Billing Address */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Billing Address</h2>
                    <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                            id="sameAsShipping"
                            checked={sameAsShipping}
                            onCheckedChange={(checked) => setSameAsShipping(!!checked)}
                        />
                        <label
                            htmlFor="sameAsShipping"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Same as shipping address
                        </label>
                    </div>

                    {sameAsShipping ? (
                        <Card>
                            <CardContent className="p-4">
                                <p className="font-medium">{shippingAddress.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {shippingAddress.addressLine1}
                                    {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Phone: {shippingAddress.phone}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">
                                    Different billing address functionality coming soon
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Coupon Code */}
                <div>
                    <h3 className="font-semibold mb-3">Have a coupon code?</h3>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1"
                        />
                        <Button variant="outline" disabled={!couponCode.trim()}>
                            Apply
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I agree to the{" "}
                        <a href="/terms" className="text-primary hover:underline" target="_blank">
                            Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-primary hover:underline" target="_blank">
                            Privacy Policy
                        </a>
                    </label>
                </div>

                {/* Place Order Button */}
                <Button
                    size="lg"
                    className="w-full"
                    onClick={onPlaceOrder}
                    disabled={!agreedToTerms || isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <span className="mr-2">Processing...</span>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </>
                    ) : (
                        `Place Order ${paymentMethod === 'razorpay' ? '& Pay' : ''}`
                    )}
                </Button>

                {/* Security Notice */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>🔒 Your payment information is secure and encrypted</p>
                </div>
        </div>
    );
}
