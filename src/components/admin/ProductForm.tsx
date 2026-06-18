"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Plus, Trash2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    shortDesc: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    price: z.number().min(0, "Price must be positive"),
    compareAtPrice: z.number().nullable().optional(),
    costPrice: z.number().nullable().optional(),
    inventory: z.number().int().min(0, "Inventory must be positive"),
    lowStockThreshold: z.number().int(),
    trackInventory: z.boolean(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]),
    isFeatured: z.boolean(),
    isNewArrival: z.boolean(),
    isBestseller: z.boolean(),
    fabric: z.string().optional(),
    care: z.string().optional(),
    occasion: z.string().optional(), // Comma-separated
    pattern: z.string().optional(),
    sleeveType: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const variantSchema = z.object({
    size: z.string().min(1, "Size is required"),
    color: z.string().min(1, "Color is required"),
    stock: z.number().int().min(0, "Stock must be 0 or greater"),
    priceAdjustment: z.number().min(0, "Price adjustment must be 0 or greater"),
});

interface ProductFormProps {
    categories: { id: string; name: string }[];
    initialData?: Partial<ProductFormData> & {
        id?: string;
        images?: string[];
        variants?: { size: string; color: string; stock: number; priceAdjustment: number }[];
    };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Images State
    const [imageUrls, setImageUrls] = useState<string[]>(
        initialData?.images || [""]
    );

    // Dynamic Variants State
    const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>(
        initialData?.variants || [
            { size: "M", color: "Default", stock: 10, priceAdjustment: 0 }
        ]
    );

    const handleAddImage = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...imageUrls];
        newImages.splice(index, 1);
        setImageUrls(newImages.length > 0 ? newImages : [""]);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...imageUrls];
        newImages[index] = value;
        setImageUrls(newImages);
    };

    const handleAddVariantRow = () => {
        setVariants([...variants, { size: "M", color: "", stock: 10, priceAdjustment: 0 }]);
    };

    const handleRemoveVariantRow = (index: number) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants.length > 0 ? newVariants : [{ size: "M", color: "Default", stock: 10, priceAdjustment: 0 }]);
    };

    const handleVariantChange = (index: number, field: keyof z.infer<typeof variantSchema>, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = {
            ...newVariants[index],
            [field]: value
        };
        setVariants(newVariants);
    };

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            status: "DRAFT",
            inventory: 0,
            lowStockThreshold: 10,
            trackInventory: true,
            isFeatured: false,
            isNewArrival: false,
            isBestseller: false,
            ...initialData,
        },
    });

    const name = watch("name");

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue("name", value);
        if (!initialData?.slug) {
            setValue("slug", slugify(value));
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        // Validation check for variants
        const validVariants = variants.filter(v => v.size && v.color);
        if (validVariants.length === 0) {
            toast.error("Please add at least one valid variant with Size and Color.");
            return;
        }

        // Filter out empty image URLs
        const validImages = imageUrls.filter(url => url.trim() !== "");
        if (validImages.length === 0) {
            toast.error("Please add at least one product image URL.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert occasion string to array
            const occasionArray = data.occasion
                ? data.occasion.split(",").map((o) => o.trim())
                : [];

            const payload = {
                ...data,
                occasion: occasionArray,
                images: validImages,
                variants: validVariants.map(v => ({
                    size: v.size,
                    color: v.color,
                    stock: Number(v.stock),
                    priceAdjustment: Number(v.priceAdjustment)
                }))
            };

            const url = initialData?.id
                ? `/api/admin/products/${initialData.id}`
                : "/api/admin/products";

            const method = initialData?.id ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Failed to save product");
            }

            toast.success(
                initialData?.id
                    ? "Product updated successfully"
                    : "Product created successfully"
            );
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error(error.message || "Failed to save product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {initialData?.id ? "Edit Product" : "Add Product"}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/products">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    onChange={handleNameChange}
                                    placeholder="e.g., Elegant Silk Saree"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    {...register("slug")}
                                    placeholder="elegant-silk-saree"
                                />
                                {errors.slug && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.slug.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="shortDesc">Short Description</Label>
                                <Input
                                    id="shortDesc"
                                    {...register("shortDesc")}
                                    placeholder="Brief product description"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Full Description *</Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    rows={6}
                                    placeholder="Detailed product description..."
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="price">Price (₹) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        {...register("price", { valueAsNumber: true })}
                                        placeholder="0.00"
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.price.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="compareAtPrice">
                                        Compare at Price (₹)
                                    </Label>
                                    <Input
                                        id="compareAtPrice"
                                        type="number"
                                        step="0.01"
                                        defaultValue={initialData?.compareAtPrice || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setValue("compareAtPrice", val ? parseFloat(val) : null);
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="costPrice">Cost Price (₹)</Label>
                                    <Input
                                        id="costPrice"
                                        type="number"
                                        step="0.01"
                                        defaultValue={initialData?.costPrice || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setValue("costPrice", val ? parseFloat(val) : null);
                                        }}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fabric">Fabric</Label>
                                    <Input
                                        id="fabric"
                                        {...register("fabric")}
                                        placeholder="e.g., Silk, Cotton"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="pattern">Pattern</Label>
                                    <Input
                                        id="pattern"
                                        {...register("pattern")}
                                        placeholder="e.g., Printed, Embroidered"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="sleeveType">Sleeve Type</Label>
                                    <Input
                                        id="sleeveType"
                                        {...register("sleeveType")}
                                        placeholder="e.g., Full, Half"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="occasion">
                                        Occasions (comma-separated)
                                    </Label>
                                    <Input
                                        id="occasion"
                                        {...register("occasion")}
                                        placeholder="Wedding, Party, Casual"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="care">Care Instructions</Label>
                                <Textarea
                                    id="care"
                                    {...register("care")}
                                    rows={3}
                                    placeholder="How to care for this product..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    {...register("metaTitle")}
                                    placeholder="SEO title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="metaDesc">Meta Description</Label>
                                <Textarea
                                    id="metaDesc"
                                    {...register("metaDesc")}
                                    rows={3}
                                    placeholder="SEO description"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Gallery Section */}
                    <Card className="glass-card shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-serif text-primary">Product Gallery</CardTitle>
                                <CardDescription>Provide public image URLs for this product.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddImage}
                                className="border-primary/40 text-primary hover:bg-primary/5"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Image
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <span className="text-xs font-semibold text-muted-foreground w-6 font-mono">#{index + 1}</span>
                                    <Input
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder="https://images.unsplash.com/photo-... or other CDN image link"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveImage(index)}
                                        className="text-destructive hover:bg-destructive/10"
                                        disabled={imageUrls.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Inventory & Size Variants Section */}
                    <Card className="glass-card shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-serif text-primary">Inventory & Size Variants</CardTitle>
                                <CardDescription>Define size, color, inventory levels, and custom price adjustments.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddVariantRow}
                                className="border-primary/40 text-primary hover:bg-primary/5"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Variant
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-border/80 pb-2 text-muted-foreground font-semibold">
                                            <th className="py-2 pr-2">Size *</th>
                                            <th className="py-2 px-2">Color *</th>
                                            <th className="py-2 px-2">Stock (Inventory) *</th>
                                            <th className="py-2 px-2">Price Adjustment (₹)</th>
                                            <th className="py-2 pl-2 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {variants.map((v, index) => (
                                            <tr key={index} className="hover:bg-muted/10">
                                                <td className="py-3 pr-2 w-[140px]">
                                                    <Select
                                                        defaultValue={v.size}
                                                        onValueChange={(val) => handleVariantChange(index, "size", val)}
                                                    >
                                                        <SelectTrigger className="h-9">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="S">S</SelectItem>
                                                            <SelectItem value="M">M</SelectItem>
                                                            <SelectItem value="L">L</SelectItem>
                                                            <SelectItem value="XL">XL</SelectItem>
                                                            <SelectItem value="XXL">XXL</SelectItem>
                                                            <SelectItem value="XXXL">XXXL</SelectItem>
                                                            <SelectItem value="2-3Y">2-3 Years (Kids)</SelectItem>
                                                            <SelectItem value="4-5Y">4-5 Years (Kids)</SelectItem>
                                                            <SelectItem value="6-7Y">6-7 Years (Kids)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <Input
                                                        value={v.color}
                                                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                                                        placeholder="e.g. Maroon"
                                                        className="h-9"
                                                    />
                                                </td>
                                                <td className="py-3 px-2 w-[110px]">
                                                    <Input
                                                        type="number"
                                                        value={v.stock}
                                                        onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                                                        placeholder="10"
                                                        min="0"
                                                        className="h-9"
                                                    />
                                                </td>
                                                <td className="py-3 px-2 w-[140px]">
                                                    <div className="relative">
                                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">₹</span>
                                                        <Input
                                                            type="number"
                                                            value={v.priceAdjustment}
                                                            onChange={(e) => handleVariantChange(index, "priceAdjustment", parseFloat(e.target.value) || 0)}
                                                            placeholder="0"
                                                            min="0"
                                                            className="h-9 pl-6"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 pl-2 text-right w-[60px]">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveVariantRow(index)}
                                                        className="text-destructive hover:bg-destructive/10"
                                                        disabled={variants.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="status">Product Status *</Label>
                                <Select
                                    defaultValue={initialData?.status || "DRAFT"}
                                    onValueChange={(value) =>
                                        setValue("status", value as any)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">
                                            Published
                                        </SelectItem>
                                        <SelectItem value="ARCHIVED">
                                            Archived
                                        </SelectItem>
                                        <SelectItem value="OUT_OF_STOCK">
                                            Out of Stock
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register("isFeatured")}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Featured Product</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register("isNewArrival")}
                                        className="rounded"
                                    />
                                    <span className="text-sm">New Arrival</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        {...register("isBestseller")}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Bestseller</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organization */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="categoryId">Category *</Label>
                                <Select
                                    defaultValue={initialData?.categoryId}
                                    onValueChange={(value) =>
                                        setValue("categoryId", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.categoryId.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    {...register("sku")}
                                    placeholder="PROD-001"
                                />
                                {errors.sku && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.sku.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="inventory">Inventory *</Label>
                                <Input
                                    id="inventory"
                                    type="number"
                                    {...register("inventory", { valueAsNumber: true })}
                                    placeholder="0"
                                />
                                {errors.inventory && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.inventory.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="lowStockThreshold">
                                    Low Stock Threshold
                                </Label>
                                <Input
                                    id="lowStockThreshold"
                                    type="number"
                                    {...register("lowStockThreshold", { valueAsNumber: true })}
                                    placeholder="10"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
