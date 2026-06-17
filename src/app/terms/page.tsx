"use client";

import Link from "next/link";
import { FileText, Hammer, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function TermsPage() {
    // Fetch Anarkali Suits for bottom showcase
    const { data, isLoading } = useProducts({
        category: "anarkali-suits",
        pageSize: 4
    });

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Agreement</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Terms of Service</h1>
                <p className="text-muted-foreground">
                    The terms and conditions governing your purchases and boutique interactions at LaBelle.
                </p>
            </div>

            {/* Legal text details */}
            <div className="max-w-4xl mx-auto space-y-8 bg-background border border-secondary/15 rounded-3xl p-8 shadow-sm text-sm sm:text-base text-muted-foreground leading-relaxed">
                <div className="space-y-3">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                        <Scale className="h-5 w-5" /> Terms of Website Use
                    </h2>
                    <p>
                        By accessing this website, you agree to comply with our usage conditions. The content, graphics, and logo displayed on LaBelle Indian Fashions are intellectual properties protected by trade dress and copyright laws. They may not be reproduced without written permission.
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5" /> Contract of Sale & Pricing
                    </h2>
                    <p>
                        All prices listed inside our catalog are represented in Indian Rupees (₹/INR). The receipt of an order confirmation does not signify our acceptance of an order. We reserve the right to accept or decline order requests for any reason, including verification issues, catalog pricing faults, or inventory deficits.
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                        <Hammer className="h-5 w-5" /> Custom stitching contracts
                    </h2>
                    <p>
                        When ordering custom-tailored garments, the buyer is solely responsible for submitting correct body metrics. Once tailoring has commenced, the order cannot be canceled, refunded, or altered. We guarantee the garment is sewn within 1.5 cm of the submitted parameters.
                    </p>
                </div>
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Regal Flare Collection</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">Anarkali Showcase</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=anarkali-suits">
                            View All Anarkalis <ArrowRight className="ml-2 h-4 w-4" />
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
