"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
    return (
        <section className={cn("relative h-[85vh] w-full bg-gradient-to-br from-background via-muted to-accent/20 flex items-center overflow-hidden border-b", className)}>
            {/* Background Decorative Blur Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[150px] animate-pulse pointer-events-none delay-1000" />
            
            <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center">
                {/* Content Area */}
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left duration-700">
                    <span className="text-secondary font-bold tracking-widest uppercase text-xs sm:text-sm border-l-2 border-secondary pl-3">
                        Exclusives for Women & Kids
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight tracking-tight text-foreground">
                        Elegance in Every <span className="italic text-primary font-medium">Stitch</span>
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-md font-sans leading-relaxed">
                        Discover the timeless beauty of handpicked Indian ethnic wear. Exquisite Sarees, Lehengas, Salwars, and adorable traditional wear for kids under 7.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button size="lg" className="shimmer bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8" asChild>
                            <Link href="/products">
                                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 font-semibold px-8" asChild>
                            <Link href="/products?category=lehengas">View Lehengas</Link>
                        </Button>
                    </div>
                </div>

                {/* Hero Image Section */}
                <div className="hidden md:block relative h-[650px] w-full animate-in fade-in slide-in-from-right duration-700 delay-200">
                    <div className="absolute inset-0 bg-luxury-gold p-[2px] rounded-2xl shadow-2xl">
                        <div className="w-full h-full bg-background rounded-[14px] overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src="/images/hero.png" 
                                alt="LaBelle Indian Fashions - Luxury Traditional Collection" 
                                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" 
                            />
                            {/* Sophisticated Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
