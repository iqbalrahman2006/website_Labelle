"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

export default function FAQPage() {
    // Fetch Salwar Suits for showcase
    const { data, isLoading } = useProducts({
        category: "salwar-suits",
        pageSize: 4
    });

    const faqs = [
        {
            q: "Do you offer custom tailoring / size customization?",
            a: "Yes! We specialize in custom tailoring for Salwars, Anarkalis, and Lehengas. Once you place an order, you can send us your measurement specifications via email (concierge@labelle.com) along with your Order ID, and our styling team will coordinate the stitching."
        },
        {
            q: "What is your shipping policy?",
            a: "We offer FREE standard shipping across India on all orders over ₹999. For international shipments, shipping charges are calculated at checkout based on weight and country destination. Orders are usually processed in 2-4 business days."
        },
        {
            q: "Do you have kids traditional wear?",
            a: "Yes! We have an exclusive collection of traditional wear for kids under 7 years old. You can browse under-7 boys kurtas, girls ghagras, and cute silk sets in our Kids category."
        },
        {
            q: "Can I return or exchange my outfit?",
            a: "We offer a hassle-free 30-day return policy for unstitched or standard-size items in their original condition. Please note that custom-stitched items cannot be returned or exchanged unless there is a physical manufacturing defect."
        },
        {
            q: "How can I track my order status?",
            a: "Once your order is shipped, you will receive an email confirmation with a tracking number and carrier details (BlueDart, DHL, or FedEx). You can also track your orders directly from your LaBelle Customer Dashboard."
        },
        {
            q: "What payment methods do you accept?",
            a: "We support secure payments via Razorpay (Credit/Debit cards, NetBanking, UPI, wallets) and Cash on Delivery (COD) for domestic orders inside India."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Got Questions?</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">
                    Everything you need to know about our designer ensembles, custom fitting, shipping, and returns.
                </p>
            </div>

            {/* Accordion FAQ Grid */}
            <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div 
                            key={i} 
                            className="bg-background border border-secondary/15 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                        >
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex justify-between items-center p-6 text-left hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex gap-3 items-center">
                                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="font-semibold text-foreground text-sm sm:text-base">{faq.q}</span>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                            
                            {isOpen && (
                                <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-muted/50 bg-muted/10">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Fresh Arrivals</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">New Arrivals Preview</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=salwar-suits">
                            View All Salwar Suits <ArrowRight className="ml-2 h-4 w-4" />
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
