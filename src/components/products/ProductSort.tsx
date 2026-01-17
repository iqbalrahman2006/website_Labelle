"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popularity';

interface ProductSortProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' },
];

export function ProductSort({ value, onChange }: ProductSortProps) {
    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
                Sort by:
            </Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="sort" className="w-[180px]">
                    <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
