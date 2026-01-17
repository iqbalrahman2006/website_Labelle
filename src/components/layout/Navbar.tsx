"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-serif text-2xl font-bold tracking-tighter">LA BELLE</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/products" className="transition-colors hover:text-primary">All Products</Link>
                        <Link href="/categories/kurtis" className="transition-colors hover:text-primary">Kurtis</Link>
                        <Link href="/categories/traditional" className="transition-colors hover:text-primary">Traditional</Link>
                        <Link href="/categories/kids" className="transition-colors hover:text-primary">Kids</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-1 justify-end max-w-md ml-auto">
                    <div className="hidden lg:flex relative w-full items-center mr-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/account">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Placeholder */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4">
                    <Link href="/products" className="text-sm font-medium">All Products</Link>
                    <Link href="/categories/kurtis" className="text-sm font-medium">Kurtis</Link>
                    <Link href="/categories/traditional" className="text-sm font-medium">Traditional</Link>
                    <Link href="/categories/kids" className="text-sm font-medium">Kids</Link>
                </div>
            )}
        </nav>
    );
}
