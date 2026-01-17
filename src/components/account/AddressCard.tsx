"use client";

import { Edit, Trash2, Home, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Address {
    id: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    landmark?: string;
    addressType: 'HOME' | 'OFFICE' | 'OTHER';
    isDefault: boolean;
}

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (addressId: string) => void;
    onSetDefault?: (addressId: string) => void;
}

const ADDRESS_TYPE_CONFIG = {
    HOME: { label: "Home", icon: Home },
    OFFICE: { label: "Office", icon: Briefcase },
    OTHER: { label: "Other", icon: MapPin },
};

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    const typeConfig = ADDRESS_TYPE_CONFIG[address.addressType];
    const TypeIcon = typeConfig.icon;

    return (
        <Card className={cn(address.isDefault && "border-primary")}>
            <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary">{typeConfig.label}</Badge>
                        {address.isDefault && (
                            <Badge variant="default">Default</Badge>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit(address)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => onDelete(address.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1">
                    <p className="font-semibold">{address.name}</p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                    <p className="text-sm">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    {address.landmark && (
                        <p className="text-sm text-muted-foreground">
                            Landmark: {address.landmark}
                        </p>
                    )}
                    <p className="text-sm">
                        {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm">{address.country}</p>
                </div>

                {/* Set as Default Button */}
                {!address.isDefault && onSetDefault && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => onSetDefault(address.id)}
                    >
                        Set as Default
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
