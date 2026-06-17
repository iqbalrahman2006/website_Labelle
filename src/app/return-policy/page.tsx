"use client";

import Link from "next/link";
import { Undo2, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function ReturnPolicyPage() {
    // Fetch Palazzo Sets for bottom showcase
    const { data, isLoading } = useProducts({
        category: "palazzo-sets",
        pageSize: 4
    });

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Exchanges</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Returns & Exchanges Policy</h1>
                <p className="text-muted-foreground">
                    Our simple guidelines for returning or exchanging your traditional outfits.
                </p>
            </div>

            {/* Split Information Details */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Eligible items */}
                <div className="bg-background border border-secondary/15 rounded-3xl p-8 shadow-sm space-y-4">
                    <h2 className="text-xl font-serif font-bold text-green-700 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> What Can Be Returned
                    </h2>
                    <ul className="space-y-3 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                        <li>Unstitched dress materials and fabric sets.</li>
                        <li>Standard off-the-rack sizes (XS, S, M, L, XL, XXL) in their original, unworn, and unwashed condition.</li>
                        <li>Items returned within **30 days** of the original delivery date.</li>
                        <li>Items with all original tags, boxes, and packaging fully intact.</li>
                    </ul>
                </div>

                {/* Non-eligible items */}
                <div className="bg-background border border-secondary/15 rounded-3xl p-8 shadow-sm space-y-4">
                    <h2 className="text-xl font-serif font-bold text-red-700 flex items-center gap-2">
                        <XCircle className="h-5 w-5" /> Non-Returnable Items
                    </h2>
                    <ul className="space-y-3 text-sm sm:text-base text-muted-foreground list-disc pl-5">
                        <li>Custom tailored or custom stitched outfits (e.g. customized lehengas or salwars tailored to your metrics).</li>
                        <li>Items purchased during clearance sales or promotional deep discounts.</li>
                        <li>Garments that show visible signs of wear, washing, alteration, or perfume spray.</li>
                        <li>Dupattas or accessories showing thread pullouts.</li>
                    </ul>
                </div>
            </div>

            {/* Process Box */}
            <div className="max-w-5xl mx-auto bg-muted/40 rounded-3xl p-8 border border-secondary/10 text-center space-y-6">
                <Undo2 className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-2xl font-serif font-bold">How to Initiate a Return</h3>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
                    Log in to your LaBelle customer portal, go to your Order History, select the item you wish to return, and click **Request Return**. Once approved, we will send you a pre-paid return shipping label (for domestic orders).
                </p>
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Modern Comfort Collection</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">Palazzo Sets Spotlight</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=palazzo-sets">
                            View All Palazzo Sets <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <ProductGrid 
                    products={data?.products || []} 
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
}
