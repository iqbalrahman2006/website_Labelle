"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";

export default function AboutPage() {
    // Fetch some Sarees or Lehengas for the bottom showcase
    const { data, isLoading } = useProducts({
        category: "lehengas",
        pageSize: 4
    });

    const pillars = [
        {
            icon: Heart,
            title: "Artisanal Love",
            description: "Every saree, salwar, and lehenga is curated to showcase the authentic craftsmanship of Indian weavers."
        },
        {
            icon: Sparkles,
            title: "Customized Fit",
            description: "We believe fashion should fit you like a glove. We offer personalized tailoring for our entire catalog."
        },
        {
            icon: Globe,
            title: "Global Reach",
            description: "Delivering the charm of Indian ethnic wear directly to wardrobes all across the globe."
        },
        {
            icon: Award,
            title: "Premium Quality",
            description: "We use only the finest silks, pure cottons, and rich georgettes, ensuring luxury you can feel."
        }
    ];

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Hero Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Our Story</span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">LaBelle Indian Fashions</h1>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Redefining Indian ethnic wear with a blend of heritage craft and modern style for women and kids worldwide.
                </p>
            </div>

            {/* Split Story Block */}
            <div className="grid md:grid-cols-2 gap-12 items-center bg-muted/30 rounded-3xl p-8 md:p-12 border border-secondary/10">
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-primary">Elegance meets Tradition</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        LaBelle was born out of a passion to bring the rich tapestry of Indian textiles to the world. We believe that ethnic wear is not just clothing, but an art form that represents centuries of culture, weaving techniques, and heritage.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        From hand-woven Banarasi silks to delicate Chikankari embroidery from Lucknow, we collaborate with local master weavers to bring you authentic, premium apparel.
                    </p>
                    <div className="pt-2">
                        <Button className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold" asChild>
                            <Link href="/products">
                                Explore Our Weaves <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden border border-secondary/20 shadow-lg bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src="https://images.unsplash.com/photo-1610030470298-4057f794cac6?auto=format&fit=crop&w=600&q=80" 
                        alt="Indian Textiles & Craftsmanship" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            </div>

            {/* Core Pillars Grid */}
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-bold">Why Shop with Us?</h2>
                    <p className="text-muted-foreground">The pillars of our boutique experience</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((pillar, i) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={i} className="bg-background border border-secondary/15 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center space-y-4">
                                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg">{pillar.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Exquisite Showcase</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">Heritage Classics</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=lehengas">
                            View All Lehengas <ArrowRight className="ml-2 h-4 w-4" />
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
