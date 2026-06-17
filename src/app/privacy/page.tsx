"use client";

import Link from "next/link";
import { ShieldAlert, Key, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function PrivacyPage() {
    // Fetch Kurtis for bottom showcase
    const { data, isLoading } = useProducts({
        category: "kurtis",
        pageSize: 4
    });

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Security</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Privacy Policy</h1>
                <p className="text-muted-foreground">
                    How LaBelle Indian Fashions collects, uses, and safeguards your personal information.
                </p>
            </div>

            {/* Corporate disclosures */}
            <div className="max-w-4xl mx-auto space-y-8 bg-background border border-secondary/15 rounded-3xl p-8 shadow-sm text-sm sm:text-base text-muted-foreground leading-relaxed">
                <div className="space-y-3">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                        <Eye className="h-5 w-5" /> Information We Collect
                    </h2>
                    <p>
                        We collect information you provide directly to us when registering an account, placing an order, subscribing to our newsletter, or filling out a contact form. This includes your name, email, billing address, shipping address, telephone number, and custom garment measurements.
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                        <Key className="h-5 w-5" /> How We Use Your Data
                    </h2>
                    <p>
                        Your data is strictly used to process and fulfill your orders, manage custom tailoring measurements, send shipping updates, and respond to support messages. With your consent, we may also send email promotions about new arrivals or exclusive discounts.
                    </p>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" /> Third-Party Sharing
                    </h2>
                    <p>
                        We do NOT sell, lease, or rent your personal information to third parties. We share your address and contact details only with trusted shipping partners (e.g. BlueDart, DHL, FedEx) and secure payment processors (Razorpay) to execute transactions and deliver items.
                    </p>
                </div>
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Daily Wear Collection</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">Kurtis Spotlight</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=kurtis">
                            View All Kurtis <ArrowRight className="ml-2 h-4 w-4" />
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
