"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Icon */}
            <div className="mb-6 rounded-full bg-slate-100 p-8">
                <ShoppingBag className="h-16 w-16 text-slate-400" />
            </div>

            {/* Message */}
            <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
            <p className="mb-8 text-muted-foreground max-w-md">
                Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>

            {/* Suggested Categories */}
            <div className="mt-12 w-full max-w-2xl">
                <h3 className="mb-4 text-lg font-semibold">Popular Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['Kurtis', 'Sarees', 'Anarkali', 'Lehengas', 'Salwar Suits', 'Kids Wear'].map((category) => (
                        <Link
                            key={category}
                            href={`/categories/${category.toLowerCase().replace(' ', '-')}`}
                            className="p-4 border rounded-lg hover:border-primary hover:bg-slate-50 transition-all text-center"
                        >
                            <span className="font-medium">{category}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
