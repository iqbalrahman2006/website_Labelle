"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Plus, Trash2, Eye, HelpCircle } from "lucide-react";
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
import { formatCurrency, formatDiscount } from "@/lib/utils/formatters";

// Zod validation schema
const variantSchema = z.object({
    size: z.string().min(1, "Size is required"),
    color: z.string().min(1, "Color is required"),
    stock: z.number().int().min(0, "Stock must be 0 or greater"),
    priceAdjustment: z.number().min(0, "Price adjustment must be 0 or greater"),
});

const productFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price must be positive"),
    compareAtPrice: z.number().optional().nullable(),
    categoryId: z.string().min(1, "Category is required"),
    fabric: z.string().optional().nullable(),
    care: z.string().optional().nullable(),
    pattern: z.string().optional().nullable(),
    sleeveType: z.string().optional().nullable(),
    isFeatured: z.boolean(),
    isNewArrival: z.boolean(),
    isBestseller: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface NewProductFormProps {
    categories: { id: string; name: string }[];
}

export function NewProductForm({ categories }: NewProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Images State
    const [imageUrls, setImageUrls] = useState<string[]>([""]);

    // Dynamic Variants State
    const [variants, setVariants] = useState<z.infer<typeof variantSchema>[]>([
        { size: "M", color: "Default", stock: 10, priceAdjustment: 0 }
    ]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            price: 0,
            compareAtPrice: null,
            categoryId: "",
            fabric: "",
            care: "",
            pattern: "",
            sleeveType: "",
            isFeatured: false,
            isNewArrival: false,
            isBestseller: false,
        },
    });


    const watchName = watch("name");
    const watchSlug = watch("slug");
    const watchPrice = watch("price");
    const watchComparePrice = watch("compareAtPrice");
    const watchCategoryId = watch("categoryId");
    const watchIsFeatured = watch("isFeatured");
    const watchIsNewArrival = watch("isNewArrival");
    const watchIsBestseller = watch("isBestseller");

    // Auto-generate slug from name
    useEffect(() => {
        if (watchName) {
            setValue("slug", slugify(watchName));
        }
    }, [watchName, setValue]);

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
            const payload = {
                ...data,
                images: validImages,
                variants: validVariants,
            };

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 409) {
                toast.error("Error: Slug already in use! Please use a unique product name/slug.");
                setIsSubmitting(false);
                return;
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to create product");
            }

            toast.success("Product created successfully!");
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving product:", error);
            toast.error(error.message || "Failed to save product");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate discount for live preview
    const discountText = formatDiscount(watchPrice || 0, watchComparePrice || 0);
    const selectedCategoryName = categories.find(c => c.id === watchCategoryId)?.name || "Category";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[1400px] mx-auto px-4 py-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="sm" type="button" className="hover:bg-accent hover:text-accent-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Catalog
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gold-gradient font-serif">
                            Add New Product
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create a new luxury ethnic wear listing in the store catalog.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link href="/admin/products" className="w-full sm:w-auto">
                        <Button variant="outline" type="button" className="w-full">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Creating..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side (Form Details) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Basic Information */}
                    <Card className="glass-card shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-primary">Basic Information</CardTitle>
                            <CardDescription>Enter the basic identifying details for this product listing.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-semibold">Product Name *</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="e.g., Banarasi Silk Kanjeevaram Saree"
                                    className="mt-1"
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive mt-1 font-medium">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="slug" className="text-sm font-semibold">Slug (Auto-generated) *</Label>
                                    <Input
                                        id="slug"
                                        {...register("slug")}
                                        placeholder="banarasi-silk-kanjeevaram-saree"
                                        className="mt-1"
                                    />
                                    {errors.slug && (
                                        <p className="text-xs text-destructive mt-1 font-medium">
                                            {errors.slug.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="categoryId" className="text-sm font-semibold">Category *</Label>
                                    <div className="mt-1">
                                        <Select
                                            onValueChange={(val) => setValue("categoryId", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.categoryId && (
                                        <p className="text-xs text-destructive mt-1 font-medium">
                                            {errors.categoryId.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-sm font-semibold">Full Description *</Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    rows={5}
                                    placeholder="Describe the weave, fabric feel, embroidery style, and fit characteristics in detail..."
                                    className="mt-1"
                                />
                                {errors.description && (
                                    <p className="text-xs text-destructive mt-1 font-medium">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card className="glass-card shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-primary">Pricing (INR)</CardTitle>
                            <CardDescription>Specify the sale price and comparison retail price.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="price" className="text-sm font-semibold">Price (₹) *</Label>
                                    <div className="relative mt-1">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₹</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            className="pl-7"
                                            placeholder="0.00"
                                            {...register("price", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className="text-xs text-destructive mt-1 font-medium">
                                            {errors.price.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="compareAtPrice" className="text-sm font-semibold">Compare At Price (₹)</Label>
                                    <div className="relative mt-1">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">₹</span>
                                        <Input
                                            id="compareAtPrice"
                                            type="number"
                                            step="0.01"
                                            className="pl-7"
                                            placeholder="0.00"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setValue("compareAtPrice", val ? parseFloat(val) : null);
                                            }}
                                        />
                                    </div>
                                    {discountText && (
                                        <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                                                {discountText}
                                            </span>
                                            calculated live discount
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attributes */}
                    <Card className="glass-card shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-primary">Attributes & Specifications</CardTitle>
                            <CardDescription>Additional structural metadata for product filters and detailed descriptions.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fabric" className="text-sm font-semibold">Fabric Type</Label>
                                <Input
                                    id="fabric"
                                    {...register("fabric")}
                                    placeholder="e.g., Pure Kora Silk, Georgette"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="pattern" className="text-sm font-semibold">Pattern / Design</Label>
                                <Input
                                    id="pattern"
                                    {...register("pattern")}
                                    placeholder="e.g., Zari Brocade, Floral Printed"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="sleeveType" className="text-sm font-semibold">Sleeve Type</Label>
                                <Input
                                    id="sleeveType"
                                    {...register("sleeveType")}
                                    placeholder="e.g., Elbow Length, Sleeveless"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="care" className="text-sm font-semibold">Care Instructions</Label>
                                <Input
                                    id="care"
                                    {...register("care")}
                                    placeholder="e.g., Dry Clean Only"
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images Section */}
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
                                    <span className="text-xs font-semibold text-muted-foreground w-6">#{index + 1}</span>
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

                    {/* Variants Section */}
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
                                                        placeholder="e.g. Royal Blue"
                                                        className="h-9"
                                                    />
                                                </td>
                                                <td className="py-3 px-2 w-[120px]">
                                                    <Input
                                                        type="number"
                                                        value={v.stock}
                                                        onChange={(e) => handleVariantChange(index, "stock", parseInt(e.target.value) || 0)}
                                                        className="h-9"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="py-3 px-2 w-[160px]">
                                                    <div className="relative">
                                                        <span className="absolute left-2.5 top-2 text-muted-foreground text-xs">₹</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={v.priceAdjustment}
                                                            onChange={(e) => handleVariantChange(index, "priceAdjustment", parseFloat(e.target.value) || 0)}
                                                            className="h-9 pl-6"
                                                            placeholder="0.00"
                                                            min="0"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 pl-2 text-right">
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

                {/* Right side (Organization, Status, Live Preview) */}
                <div className="space-y-8">
                    {/* Status, Toggles & Flags */}
                    <Card className="glass-card shadow-sm border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif text-primary">Listing Flags & Status</CardTitle>
                            <CardDescription>Determine catalog visibility and promotional badges.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Switch components styled with custom CSS */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isFeatured" className="flex flex-col gap-0.5 cursor-pointer">
                                        <span className="font-semibold text-slate-800 text-sm">Featured Product</span>
                                        <span className="text-xs text-muted-foreground">Show in home banner slider</span>
                                    </Label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="isFeatured"
                                            {...register("isFeatured")}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                                    <Label htmlFor="isNewArrival" className="flex flex-col gap-0.5 cursor-pointer">
                                        <span className="font-semibold text-slate-800 text-sm">New Arrival</span>
                                        <span className="text-xs text-muted-foreground">Add a premium &apos;New&apos; badge</span>
                                    </Label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="isNewArrival"
                                            {...register("isNewArrival")}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                                    <Label htmlFor="isBestseller" className="flex flex-col gap-0.5 cursor-pointer">
                                        <span className="font-semibold text-slate-800 text-sm">Bestseller</span>
                                        <span className="text-xs text-muted-foreground">Add high conversion badge</span>
                                    </Label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="isBestseller"
                                            {...register("isBestseller")}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interactive Real-time Product Card Preview */}
                    <div className="sticky top-6">
                        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-primary">
                            <Eye className="h-4 w-4" /> Live Catalog Preview
                        </div>

                        {/* Public UI style Product Card */}
                        <Card className="group relative overflow-hidden transition-all hover:shadow-lg border-primary/10">
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                {imageUrls[0] && imageUrls[0].trim() !== "" ? (
                                    <img
                                        src={imageUrls[0]}
                                        alt={watchName || "Product Preview"}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop";
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-slate-400 bg-slate-50 gap-2">
                                        <HelpCircle className="h-10 w-10 stroke-1" />
                                        <span className="text-xs">Provide image URL for preview</span>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute left-2 top-2 flex flex-col gap-2 z-10">
                                    {watchIsNewArrival && (
                                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            NEW
                                        </span>
                                    )}
                                    {watchIsBestseller && (
                                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            BESTSELLER
                                        </span>
                                    )}
                                    {discountText && (
                                        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                            {discountText}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 bg-white">
                                {/* Category */}
                                <p className="mb-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                    {selectedCategoryName}
                                </p>

                                {/* Product Name */}
                                <h3 className="mb-2 text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                                    {watchName || "Banarasi Silk Saree"}
                                </h3>

                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                    <span className="text-base font-bold text-slate-900">
                                        {formatCurrency(watchPrice || 0)}
                                    </span>
                                    {watchComparePrice && watchComparePrice > (watchPrice || 0) && (
                                        <span className="text-xs text-muted-foreground line-through">
                                            {formatCurrency(watchComparePrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </form>
    );
}
