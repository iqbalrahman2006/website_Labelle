"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/formatters";

interface ProductVariant {
    id: string;
    sku: string;
    size?: string;
    color?: string;
    colorHex?: string;
    priceAdjustment: number;
    inventory: number;
    isActive: boolean;
}

interface VariantSelectorProps {
    variants: ProductVariant[];
    basePrice: number;
    onVariantChange: (variant: ProductVariant | null) => void;
}

export function VariantSelector({ variants, basePrice, onVariantChange }: VariantSelectorProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    // Extract unique sizes and colors
    const sizes = Array.from(new Set(variants.filter(v => v.size).map(v => v.size!)));
    const colors = Array.from(new Set(variants.filter(v => v.color).map(v => ({
        name: v.color!,
        hex: v.colorHex,
    }))), (item) => item.name).map(name => {
        const variant = variants.find(v => v.color === name);
        return {
            name,
            hex: variant?.colorHex,
        };
    });

    // Find matching variant based on selections
    useEffect(() => {
        if (variants.length === 0) {
            onVariantChange(null);
            return;
        }

        // If no size/color variants, select first variant
        if (sizes.length === 0 && colors.length === 0) {
            onVariantChange(variants[0]);
            return;
        }

        // Find variant matching both size and color
        const matchingVariant = variants.find(v => {
            const sizeMatch = !selectedSize || v.size === selectedSize;
            const colorMatch = !selectedColor || v.color === selectedColor;
            return sizeMatch && colorMatch && v.isActive;
        });

        onVariantChange(matchingVariant || null);
    }, [selectedSize, selectedColor, variants, onVariantChange, sizes.length, colors.length]);

    // Get current variant for price display
    const currentVariant = variants.find(v => {
        const sizeMatch = !selectedSize || v.size === selectedSize;
        const colorMatch = !selectedColor || v.color === selectedColor;
        return sizeMatch && colorMatch && v.isActive;
    });

    const currentPrice = basePrice + (currentVariant?.priceAdjustment || 0);

    // Check if a size is available for the selected color
    const isSizeAvailable = (size: string) => {
        return variants.some(v =>
            v.size === size &&
            (!selectedColor || v.color === selectedColor) &&
            v.isActive &&
            v.inventory > 0
        );
    };

    // Check if a color is available for the selected size
    const isColorAvailable = (color: string) => {
        return variants.some(v =>
            v.color === color &&
            (!selectedSize || v.size === selectedSize) &&
            v.isActive &&
            v.inventory > 0
        );
    };

    if (variants.length === 0 || (sizes.length === 0 && colors.length === 0)) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            {sizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Size</Label>
                        {selectedSize && (
                            <span className="text-sm text-muted-foreground">
                                Selected: {selectedSize}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const available = isSizeAvailable(size);
                            const isSelected = selectedSize === size;

                            return (
                                <Button
                                    key={size}
                                    variant={isSelected ? "default" : "outline"}
                                    size="lg"
                                    className={cn(
                                        "min-w-[60px]",
                                        !available && "opacity-50 cursor-not-allowed"
                                    )}
                                    onClick={() => setSelectedSize(isSelected ? null : size)}
                                    disabled={!available}
                                >
                                    {size}
                                    {!available && (
                                        <span className="ml-1 text-xs">(Out)</span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Color</Label>
                        {selectedColor && (
                            <span className="text-sm text-muted-foreground">
                                Selected: {selectedColor}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const available = isColorAvailable(color.name);
                            const isSelected = selectedColor === color.name;

                            return (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(isSelected ? null : color.name)}
                                    disabled={!available}
                                    className={cn(
                                        "group relative flex flex-col items-center gap-2 transition-all",
                                        !available && "opacity-50 cursor-not-allowed"
                                    )}
                                    title={color.name}
                                >
                                    <div
                                        className={cn(
                                            "h-10 w-10 rounded-full border-2 transition-all",
                                            isSelected
                                                ? "border-primary scale-110 ring-2 ring-primary ring-offset-2"
                                                : "border-slate-300 group-hover:scale-105"
                                        )}
                                        style={{ backgroundColor: color.hex || '#ccc' }}
                                    />
                                    <span className="text-xs text-center max-w-[60px] truncate">
                                        {color.name}
                                    </span>
                                    {!available && (
                                        <Badge variant="secondary" className="absolute -top-1 -right-1 text-[10px] px-1">
                                            Out
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Price Update */}
            {currentVariant && currentVariant.priceAdjustment !== 0 && (
                <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Selected variant price:</span>
                        <span className="text-lg font-bold">{formatCurrency(currentPrice)}</span>
                    </div>
                </div>
            )}

            {/* Stock Info */}
            {currentVariant && currentVariant.inventory <= 10 && currentVariant.inventory > 0 && (
                <p className="text-sm text-amber-600">
                    Only {currentVariant.inventory} left in stock for this variant
                </p>
            )}
        </div>
    );
}
