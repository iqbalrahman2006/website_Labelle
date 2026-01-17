import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col gap-16 pb-16">
            {/* Hero Section */}
            <HeroSection />

            {/* Trust Badges */}
            <section className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y">
                    <div className="flex items-center gap-4">
                        <Truck className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Free Shipping</h3>
                            <p className="text-xs text-muted-foreground">On orders over ₹999</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ShieldCheck className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Secure Payment</h3>
                            <p className="text-xs text-muted-foreground">100% Secure Checkout</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ShoppingBag className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Easy Returns</h3>
                            <p className="text-xs text-muted-foreground">30 Days Return Policy</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Star className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Best Quality</h3>
                            <p className="text-xs text-muted-foreground">Handpicked Collection</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <FeaturedProducts />

            {/* Category Showcase */}
            <CategoryShowcase />

            {/* New Arrivals */}
            <NewArrivals />
        </div>
    );
}
