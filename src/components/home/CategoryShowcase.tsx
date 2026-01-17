"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    {
        name: "Kurtis",
        slug: "kurtis",
        description: "Elegant and comfortable everyday wear",
        color: "from-pink-500 to-rose-500",
    },
    {
        name: "Sarees",
        slug: "sarees",
        description: "Traditional elegance redefined",
        color: "from-purple-500 to-indigo-500",
    },
    {
        name: "Anarkali",
        slug: "anarkali",
        description: "Graceful and timeless designs",
        color: "from-blue-500 to-cyan-500",
    },
];

export function CategoryShowcase() {
    return (
        <section className="container py-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold">Shop by Category</h2>
                    <p className="text-muted-foreground">Explore our curated collections</p>
                </div>
                <Button variant="link" asChild>
                    <Link href="/products">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CATEGORIES.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="group relative h-96 overflow-hidden rounded-xl"
                    >
                        {/* Background Gradient */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity group-hover:opacity-100",
                            category.color
                        )} />

                        {/* Placeholder Image */}
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300 font-serif text-xl">
                            {category.name} Image
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2 transform transition-transform group-hover:translate-y-[-4px]">
                                {category.name}
                            </h3>
                            <p className="text-sm text-white/90 mb-4">
                                {category.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Shop Now <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
