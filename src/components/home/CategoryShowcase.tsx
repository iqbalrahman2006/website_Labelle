"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
    {
        name: "Sarees",
        slug: "sarees",
        description: "Timeless 6-yard drapes in silk and organza",
        image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Lehengas",
        slug: "lehengas",
        description: "Stunning bridal and bridesmaid designer lehengas",
        image: "https://images.unsplash.com/photo-1610030470298-4057f794cac6?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Anarkali Suits",
        slug: "anarkali-suits",
        description: "Regal floor-sweeping flared kurtis and gowns",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Kids Ethnic Wear",
        slug: "kids-ethnic-wear",
        description: "Adorable traditional outfits for kids under 7",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80",
    },
];

export function CategoryShowcase() {
    return (
        <section className="container py-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <span className="text-secondary font-semibold uppercase tracking-wider text-xs">Handpicked Collections</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-1">Shop by Category</h2>
                </div>
                <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                    <Link href="/products">
                        Explore All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className="group relative h-[420px] overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-secondary/15"
                    >
                        {/* Background Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Dark Radial/Linear Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />

                        {/* Gold accent line on hover */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col justify-end h-full">
                            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1 tracking-wide text-white group-hover:text-amber-200 transition-colors duration-300">
                                {category.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-4">
                                {category.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-200 uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                View Collection <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
