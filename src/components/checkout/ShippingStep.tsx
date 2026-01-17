"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddressForm } from "@/components/account/AddressForm";
import { Address } from "@/types/checkout.types";
import { cn } from "@/lib/utils";
import { estimateDeliveryDate } from "@/lib/utils/order-utils";

interface ShippingStepProps {
    addresses: Address[];
    selectedAddress?: Address;
    deliveryMethod: 'standard' | 'express';
    onAddressSelect: (address: Address) => void;
    onDeliveryMethodChange: (method: 'standard' | 'express') => void;
    onContinue: () => void;
}

export function ShippingStep({
    addresses,
    selectedAddress,
    deliveryMethod,
    onAddressSelect,
    onDeliveryMethodChange,
    onContinue,
}: ShippingStepProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddAddress = async (data: any) => {
        // TODO: Implement add address API call
        console.log('Add address:', data);
        setIsAddDialogOpen(false);
    };

    return (
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-8">
                {/* Shipping Address */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>

                    {addresses.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-4">No saved addresses</p>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add New Address
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Add Shipping Address</DialogTitle>
                                        </DialogHeader>
                                        <AddressForm
                                            onSubmit={handleAddAddress}
                                            onCancel={() => setIsAddDialogOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <RadioGroup
                                value={selectedAddress?.id}
                                onValueChange={(id) => {
                                    const address = addresses.find(a => a.id === id);
                                    if (address) onAddressSelect(address);
                                }}
                            >
                                {addresses.map((address) => (
                                    <Card
                                        key={address.id}
                                        className={cn(
                                            "cursor-pointer transition-all",
                                            selectedAddress?.id === address.id && "border-primary ring-2 ring-primary/20"
                                        )}
                                        onClick={() => onAddressSelect(address)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <RadioGroupItem value={address.id!} id={address.id} />
                                                <div className="flex-1">
                                                    <Label htmlFor={address.id} className="cursor-pointer">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-semibold">{address.name}</span>
                                                            {address.isDefault && (
                                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {address.addressLine1}
                                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {address.city}, {address.state} - {address.pincode}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Phone: {address.phone}
                                                        </p>
                                                    </Label>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </RadioGroup>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Address
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Add Shipping Address</DialogTitle>
                                    </DialogHeader>
                                    <AddressForm
                                        onSubmit={handleAddAddress}
                                        onCancel={() => setIsAddDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                {/* Delivery Method */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Delivery Method</h2>
                    <RadioGroup value={deliveryMethod} onValueChange={(value: any) => onDeliveryMethodChange(value)}>
                        <Card
                            className={cn(
                                "cursor-pointer transition-all",
                                deliveryMethod === 'standard' && "border-primary ring-2 ring-primary/20"
                            )}
                            onClick={() => onDeliveryMethodChange('standard')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <RadioGroupItem value="standard" id="standard" />
                                    <div className="flex-1">
                                        <Label htmlFor="standard" className="cursor-pointer">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold">Standard Delivery</span>
                                                <span className="text-sm font-medium">FREE</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Estimated delivery by {estimateDeliveryDate('standard')}
                                            </p>
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card
                            className={cn(
                                "cursor-pointer transition-all",
                                deliveryMethod === 'express' && "border-primary ring-2 ring-primary/20"
                            )}
                            onClick={() => onDeliveryMethodChange('express')}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <RadioGroupItem value="express" id="express" />
                                    <div className="flex-1">
                                        <Label htmlFor="express" className="cursor-pointer">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold">Express Delivery</span>
                                                <span className="text-sm font-medium">₹150</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Estimated delivery by {estimateDeliveryDate('express')}
                                            </p>
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </RadioGroup>
                </div>

                {/* Continue Button */}
                <Button
                    size="lg"
                    className="w-full"
                    onClick={onContinue}
                    disabled={!selectedAddress}
                >
                    Continue to Payment
                </Button>
            </div>

            {/* Order Summary Sidebar - Placeholder */}
            <div className="lg:sticky lg:top-24 lg:self-start">
                <Card>
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Order Summary</h3>
                        <p className="text-sm text-muted-foreground">
                            Summary will be displayed here
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
