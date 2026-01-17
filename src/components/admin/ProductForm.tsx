"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    compareAtPrice: z.number().optional(),
    costPrice: z.number().optional(),
    inventory: z.number().int().min(0, "Inventory must be positive"),
    lowStockThreshold: z.number().int().default(10),
    trackInventory: z.boolean().default(true),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "OUT_OF_STOCK"]),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    isBestseller: z.boolean().default(false),
    fabric: z.string().optional(),
    care: z.string().optional(),
    occasion: z.string().optional(), // Comma-separated
    pattern: z.string().optional(),
    sleeveType: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    categories: { id: string; name: string }[];
    initialData?: Partial<ProductFormData> & { id?: string };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
        try {
            // Convert occasion string to array
            const occasionArray = data.occasion
                ? data.occasion.split(",").map((o) => o.trim())
                : [];

            const payload = {
                ...data,
                occasion: occasionArray,
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
                throw new Error("Failed to save product");
            }

            toast.success(
                initialData?.id
                    ? "Product updated successfully"
                    : "Product created successfully"
            );
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product");
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
                                        {...register("compareAtPrice", { valueAsNumber: true })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="costPrice">Cost Price (₹)</Label>
                                    <Input
                                        id="costPrice"
                                        type="number"
                                        step="0.01"
                                        {...register("costPrice", { valueAsNumber: true })}
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
