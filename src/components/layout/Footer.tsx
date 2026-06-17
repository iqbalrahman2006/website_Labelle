import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background mt-auto">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-primary">LaBelle</Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Elegance meets tradition at LaBelle Indian Fashions. Discover the finest handpicked ethnic wear for women and kids under 7.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products" className="text-muted-foreground hover:text-secondary">All Products</Link></li>
                            <li><Link href="/products?category=kurtis" className="text-muted-foreground hover:text-secondary">Kurtis</Link></li>
                            <li><Link href="/products?category=lehengas" className="text-muted-foreground hover:text-secondary">Lehengas</Link></li>
                            <li><Link href="/products?category=kids-ethnic-wear" className="text-muted-foreground hover:text-secondary">Kids Wear (Under 7)</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-primary">FAQs</Link></li>
                            <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
                            <li><Link href="/return-policy" className="text-muted-foreground hover:text-primary">Returns & Exchanges</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} LaBelle Indian Fashions. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
