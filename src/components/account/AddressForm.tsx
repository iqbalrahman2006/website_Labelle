"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { addressSchema, AddressFormData } from "@/lib/validators";

interface AddressFormProps {
    defaultValues?: Partial<AddressFormData>;
    onSubmit: (data: AddressFormData) => Promise<void>;
    onCancel?: () => void;
}

export function AddressForm({ defaultValues, onSubmit, onCancel }: AddressFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            country: "India",
            addressType: "HOME",
            isDefault: false,
            ...defaultValues,
        },
    });

    const addressType = watch("addressType");
    const isDefault = watch("isDefault");

    const handleFormSubmit = async (data: AddressFormData) => {
        try {
            await onSubmit(data);
            toast.success(defaultValues ? "Address updated successfully" : "Address added successfully");
        } catch (error) {
            toast.error("Failed to save address");
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter full name"
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                />
                {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                <Input
                    id="addressLine1"
                    {...register("addressLine1")}
                    placeholder="House No., Building Name"
                />
                {errors.addressLine1 && (
                    <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
                )}
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                    id="addressLine2"
                    {...register("addressLine2")}
                    placeholder="Road Name, Area, Colony"
                />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                        id="city"
                        {...register("city")}
                        placeholder="City"
                    />
                    {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                        id="state"
                        {...register("state")}
                        placeholder="State"
                    />
                    {errors.state && (
                        <p className="text-sm text-destructive">{errors.state.message}</p>
                    )}
                </div>
            </div>

            {/* Pincode */}
            <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                    id="pincode"
                    {...register("pincode")}
                    placeholder="6-digit pincode"
                    maxLength={6}
                />
                {errors.pincode && (
                    <p className="text-sm text-destructive">{errors.pincode.message}</p>
                )}
            </div>

            {/* Landmark */}
            <div className="space-y-2">
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                    id="landmark"
                    {...register("landmark")}
                    placeholder="Nearby landmark"
                />
            </div>

            {/* Address Type */}
            <div className="space-y-2">
                <Label htmlFor="addressType">Address Type *</Label>
                <Select
                    value={addressType}
                    onValueChange={(value) => setValue("addressType", value as any)}
                >
                    <SelectTrigger id="addressType">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="HOME">Home</SelectItem>
                        <SelectItem value="OFFICE">Office</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Set as Default */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isDefault"
                    checked={isDefault}
                    onCheckedChange={(checked) => setValue("isDefault", !!checked)}
                />
                <label
                    htmlFor="isDefault"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Set as default address
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Saving..." : defaultValues ? "Update Address" : "Add Address"}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
