"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/formatters";

export interface ProductFilterValues {
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    occasions?: string[];
}

interface ProductFiltersProps {
    filters: ProductFilterValues;
    onFilterChange: (filters: ProductFilterValues) => void;
    categories?: Array<{ id: string; name: string; slug: string }>;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const COLORS = [
    { name: "Red", hex: "#EF4444" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Green", hex: "#10B981" },
    { name: "Yellow", hex: "#F59E0B" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
];
const OCCASIONS = ["Casual", "Festive", "Wedding", "Party", "Office", "Traditional"];
const PRICE_RANGES = [
    { label: "Under ₹1,000", min: 0, max: 1000 },
    { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
    { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
    { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
    { label: "Above ₹10,000", min: 10000, max: undefined },
];

export function ProductFilters({ filters, onFilterChange, categories = [] }: ProductFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCategoryToggle = (categoryId: string) => {
        const catObj = categories.find((c) => c.id === categoryId);
        const current = filters.categories || [];
        const hasCategory = current.some(
            (val) => val === categoryId || (catObj?.slug && val === catObj.slug)
        );
        const updated = hasCategory
            ? current.filter(
                  (val) =>
                      val !== categoryId &&
                      (catObj?.slug ? val !== catObj.slug : true)
              )
            : [...current, categoryId];
        onFilterChange({ ...filters, categories: updated });
    };

    const handleSizeToggle = (size: string) => {
        const current = filters.sizes || [];
        const updated = current.includes(size)
            ? current.filter((s) => s !== size)
            : [...current, size];
        onFilterChange({ ...filters, sizes: updated });
    };

    const handleColorToggle = (color: string) => {
        const current = filters.colors || [];
        const updated = current.includes(color)
            ? current.filter((c) => c !== color)
            : [...current, color];
        onFilterChange({ ...filters, colors: updated });
    };

    const handleOccasionToggle = (occasion: string) => {
        const current = filters.occasions || [];
        const updated = current.includes(occasion)
            ? current.filter((o) => o !== occasion)
            : [...current, occasion];
        onFilterChange({ ...filters, occasions: updated });
    };

    const handlePriceRangeSelect = (min?: number, max?: number) => {
        onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    };

    const clearAllFilters = () => {
        onFilterChange({});
    };

    const activeFilterCount =
        (filters.categories?.length || 0) +
        (filters.sizes?.length || 0) +
        (filters.colors?.length || 0) +
        (filters.occasions?.length || 0) +
        (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0);

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-semibold">Active Filters</Label>
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            Clear All
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filters.categories?.map((catId) => {
                            const cat = categories.find((c) => c.id === catId || c.slug === catId);
                            return cat ? (
                                <Badge key={catId} variant="secondary">
                                    {cat.name}
                                    <X
                                        className="ml-1 h-3 w-3 cursor-pointer"
                                        onClick={() => handleCategoryToggle(cat.id)}
                                    />
                                </Badge>
                            ) : null;
                        })}
                        {filters.sizes?.map((size) => (
                            <Badge key={size} variant="secondary">
                                {size}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() => handleSizeToggle(size)}
                                />
                            </Badge>
                        ))}
                        {filters.colors?.map((color) => (
                            <Badge key={color} variant="secondary">
                                {color}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() => handleColorToggle(color)}
                                />
                            </Badge>
                        ))}
                        {filters.occasions?.map((occasion) => (
                            <Badge key={occasion} variant="secondary">
                                {occasion}
                                <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() => handleOccasionToggle(occasion)}
                                />
                            </Badge>
                        ))}
                    </div>
                    <Separator className="mt-4" />
                </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <div>
                    <Label className="text-sm font-semibold mb-3 block">Category</Label>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`cat-${category.id}`}
                                    checked={
                                        filters.categories?.includes(category.id) ||
                                        filters.categories?.includes(category.slug)
                                    }
                                    onCheckedChange={() => handleCategoryToggle(category.id)}
                                />
                                <label
                                    htmlFor={`cat-${category.id}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <Separator className="mt-4" />
                </div>
            )}

            {/* Price Range */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                                id={`price-${index}`}
                                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                                onCheckedChange={() => handlePriceRangeSelect(range.min, range.max)}
                            />
                            <label htmlFor={`price-${index}`} className="text-sm cursor-pointer">
                                {range.label}
                            </label>
                        </div>
                    ))}
                </div>
                <Separator className="mt-4" />
            </div>

            {/* Size */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Size</Label>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                        <Button
                            key={size}
                            variant={filters.sizes?.includes(size) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSizeToggle(size)}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
                <Separator className="mt-4" />
            </div>

            {/* Color */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Color</Label>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => handleColorToggle(color.name)}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${filters.colors?.includes(color.name)
                                    ? "border-primary scale-110"
                                    : "border-slate-300"
                                }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        />
                    ))}
                </div>
                <Separator className="mt-4" />
            </div>

            {/* Occasion */}
            <div>
                <Label className="text-sm font-semibold mb-3 block">Occasion</Label>
                <div className="space-y-2">
                    {OCCASIONS.map((occasion) => (
                        <div key={occasion} className="flex items-center space-x-2">
                            <Checkbox
                                id={`occasion-${occasion}`}
                                checked={filters.occasions?.includes(occasion)}
                                onCheckedChange={() => handleOccasionToggle(occasion)}
                            />
                            <label
                                htmlFor={`occasion-${occasion}`}
                                className="text-sm cursor-pointer"
                            >
                                {occasion}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge className="ml-2" variant="secondary">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <FilterContent />
            </div>
        </>
    );
}
