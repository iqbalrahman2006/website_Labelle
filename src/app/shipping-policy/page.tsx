"use client";

import Link from "next/link";
import { Truck, Globe, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function ShippingPolicyPage() {
    // Fetch Kids ethnic wear for bottom showcase
    const { data, isLoading } = useProducts({
        category: "kids-ethnic-wear",
        pageSize: 4
    });

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Deliveries</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Shipping & Delivery Policy</h1>
                <p className="text-muted-foreground">
                    How we ship our premium traditional weaves to your doorstep, domestic and international.
                </p>
            </div>

            {/* Content Details */}
            <div className="max-w-4xl mx-auto space-y-8 bg-background border border-secondary/15 rounded-3xl p-8 shadow-sm">
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                        <Truck className="h-6 w-6" /> Domestic Shipping (India)
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We offer **FREE shipping** all across India on orders exceeding **₹999**. For orders below this amount, a flat shipping fee of **₹99** is charged.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Standard shipments inside India are delivered within **3 to 7 business days** after processing. Cash on Delivery (COD) orders might take an additional 1-2 days for telephonic verification before shipment.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                        <Globe className="h-6 w-6" /> International Shipping
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        LaBelle delivers ethnic wear to over **150 countries** globally, including the US, UK, Canada, Australia, and UAE. Shipping charges are calculated dynamically at checkout based on package weight and destination zone.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        International deliveries are dispatched via premium carriers like DHL or FedEx and take **5 to 10 business days** for transit. Any custom duties or import taxes levied by the destination country are to be borne by the customer.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
                        <Shield className="h-6 w-6" /> Custom Stitched Orders
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Please note that orders containing **custom tailoring or stitching** (such as customized salwars, stitched blouses, or tailored lehengas) require **an additional 7 to 12 business days** for tailoring before dispatch.
                    </p>
                </div>
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Ages under 7 Collection</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">Kids Wear Spotlight</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=kids-ethnic-wear">
                            View All Kids Wear <ArrowRight className="ml-2 h-4 w-4" />
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
