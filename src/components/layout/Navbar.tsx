"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src="/images/logo.png" 
                            alt="LaBelle Logo" 
                            className="h-9 w-9 object-contain rounded-full border border-secondary transition-transform duration-300 group-hover:rotate-12" 
                        />
                        <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-primary">
                            LaBelle
                        </span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/products" className="transition-colors hover:text-primary text-foreground/80 hover:text-foreground">All Products</Link>
                        <Link href="/products?category=kurtis" className="transition-colors hover:text-primary text-foreground/80 hover:text-foreground">Kurtis</Link>
                        <Link href="/products?category=lehengas" className="transition-colors hover:text-primary text-foreground/80 hover:text-foreground">Lehengas</Link>
                        <Link href="/products?category=kids-ethnic-wear" className="transition-colors hover:text-primary text-foreground/80 hover:text-foreground">Kids Wear</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-1 justify-end max-w-md ml-auto">
                    <div className="hidden lg:flex relative w-full items-center mr-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search traditional wear..."
                            className="pl-8 w-full border-secondary/30 focus-visible:ring-primary focus-visible:border-primary"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="md:hidden hover:text-primary">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="hover:text-primary">
                            <Link href="/account">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild className="relative hover:text-primary">
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden hover:text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-secondary/15 bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    <Link href="/products" className="text-sm font-medium hover:text-primary py-1 border-b border-muted" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                    <Link href="/products?category=kurtis" className="text-sm font-medium hover:text-primary py-1 border-b border-muted" onClick={() => setIsMenuOpen(false)}>Kurtis</Link>
                    <Link href="/products?category=lehengas" className="text-sm font-medium hover:text-primary py-1 border-b border-muted" onClick={() => setIsMenuOpen(false)}>Lehengas</Link>
                    <Link href="/products?category=kids-ethnic-wear" className="text-sm font-medium hover:text-primary py-1 border-b border-muted" onClick={() => setIsMenuOpen(false)}>Kids Wear</Link>
                </div>
            )}
        </nav>
    );
}
