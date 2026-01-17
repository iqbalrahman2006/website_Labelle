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
        <section className={cn("relative h-[80vh] w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center overflow-hidden", className)}>
            <div className="container relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left duration-700">
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm animate-in fade-in slide-in-from-left duration-700 delay-100">
                        New Collection 2024
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight animate-in fade-in slide-in-from-left duration-700 delay-200">
                        Elegance in Every <span className="italic text-primary">Stitch</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md animate-in fade-in slide-in-from-left duration-700 delay-300">
                        Discover the timeless beauty of Indian ethnic wear. Handcrafted Lehengas, Kurtis, and Traditional attire for the modern woman.
                    </p>
                    <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left duration-700 delay-400">
                        <Button size="lg" asChild>
                            <Link href="/products">
                                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/categories/traditional">View Collection</Link>
                        </Button>
                    </div>
                </div>
                <div className="hidden md:block relative h-[600px] w-full animate-in fade-in slide-in-from-right duration-700 delay-200">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder for Hero Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-serif italic text-2xl bg-slate-100">
                            Hero Image
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </section>
    );
}
