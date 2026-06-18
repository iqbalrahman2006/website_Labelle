import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { NewArrivals } from "@/components/home/NewArrivals";
import { ShoppingBag, Star, Truck, ShieldCheck, Award, Heart, Phone, Mail, MapPin } from "lucide-react";

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

            {/* Category Showcase (Section B) */}
            <CategoryShowcase />

            {/* New Arrivals */}
            <NewArrivals />

            {/* Section A — "About Us" / Brand Story Section */}
            <section className="w-full bg-[#FAF6F0] py-20 border-y border-secondary/10">
                <div className="container px-6 md:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-6">
                            <span className="text-secondary font-bold tracking-widest uppercase text-xs sm:text-sm border-l-2 border-secondary pl-3">
                                Heritage & Craftsmanship
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">Our Story</h2>
                            <p className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                                LaBelleIndianFashions is a family-rooted textile business bringing the
                                finest handcrafted Indian ethnic wear directly to your doorstep. We work
                                closely with weavers and artisans across Tamil Nadu, Karnataka, and
                                West Bengal to source sarees, dress materials, and traditional wear that
                                carry the heritage of generations.
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed">
                                Every piece in our collection is selected for its quality of fabric,
                                authenticity of craft, and the story behind its weave. From the gold
                                zari borders of Kanjivaram silk to the soft drapes of Chanderi cotton,
                                we believe clothing is a conversation between tradition and the woman
                                who wears it.
                            </p>
                        </div>
                        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-secondary/20 shadow-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                                alt="Handloom Weaving Craft"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/5" />
                        </div>
                    </div>

                    <div className="mt-12">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-8 text-center">Why Shop With Us</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Tile 1 */}
                            <div className="bg-white p-8 rounded-2xl border border-secondary/15 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <Award className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">Authenticity Guaranteed</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Every product is sourced directly from verified weavers and certified textile clusters.
                                </p>
                            </div>

                            {/* Tile 2 */}
                            <div className="bg-white p-8 rounded-2xl border border-secondary/15 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <Truck className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">Pan-India Delivery</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We ship to every corner of India with careful packaging to protect the delicate fabrics.
                                </p>
                            </div>

                            {/* Tile 3 */}
                            <div className="bg-white p-8 rounded-2xl border border-secondary/15 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-2">Artisan-First</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A portion of every sale goes directly back to the artisans and their families who created the piece.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section C — "Why Our Customers Love Us" / Trust Signals */}
            <section className="container py-12 px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold uppercase tracking-widest text-xs">Our Commitment</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mt-1">Loved Across India</h2>
                </div>

                {/* Stat Tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
                    <div className="p-6 bg-white rounded-2xl border border-secondary/10 shadow-sm">
                        <div className="text-4xl md:text-5xl font-bold text-primary font-serif mb-2">500+</div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Happy Customers</div>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-secondary/10 shadow-sm">
                        <div className="text-4xl md:text-5xl font-bold text-primary font-serif mb-2">100+</div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Unique Designs</div>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-secondary/10 shadow-sm">
                        <div className="text-4xl md:text-5xl font-bold text-primary font-serif mb-2">15+</div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">States Delivered To</div>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-secondary/10 shadow-sm">
                        <div className="text-4xl md:text-5xl font-bold text-primary font-serif mb-2">4.8★</div>
                        <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Average Rating</div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Testimonial 1 */}
                    <div className="bg-white p-8 rounded-2xl border border-secondary/10 shadow-md relative hover:-translate-y-1 transition-transform">
                        <div className="text-amber-400 flex gap-1 mb-4 text-sm">★★★★★</div>
                        <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">
                            &quot;The Kanjivaram saree I ordered was even more beautiful in person. The packaging was exquisite and it arrived in perfect condition.&quot;
                        </p>
                        <div>
                            <h4 className="font-bold text-foreground">Priya Subramaniam</h4>
                            <p className="text-xs text-muted-foreground">Chennai</p>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-white p-8 rounded-2xl border border-secondary/10 shadow-md relative hover:-translate-y-1 transition-transform">
                        <div className="text-amber-400 flex gap-1 mb-4 text-sm">★★★★★</div>
                        <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">
                            &quot;Excellent quality and the customer support team was so helpful. Will definitely order again for my daughter&apos;s wedding.&quot;
                        </p>
                        <div>
                            <h4 className="font-bold text-foreground">Meera Pillai</h4>
                            <p className="text-xs text-muted-foreground">Bengaluru</p>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-white p-8 rounded-2xl border border-secondary/10 shadow-md relative hover:-translate-y-1 transition-transform">
                        <div className="text-amber-400 flex gap-1 mb-4 text-sm">★★★★★</div>
                        <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">
                            &quot;Finally a store that truly understands Indian textiles. Every piece feels like it has a story. Completely worth the price.&quot;
                        </p>
                        <div>
                            <h4 className="font-bold text-foreground">Anitha Krishnan</h4>
                            <p className="text-xs text-muted-foreground">Hyderabad</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section D — "Reach Us" / Contact Information Strip */}
            <section className="bg-secondary/5 py-12 border-t border-secondary/10">
                <div className="container px-6 md:px-12 text-center">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-8">Get In Touch</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {/* Phone */}
                        <div className="flex flex-col items-center">
                            <Phone className="w-6 h-6 text-primary mb-2" />
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Call Us</span>
                            <span className="text-base font-bold text-foreground mt-1">+91 98765 43210</span>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col items-center">
                            <Mail className="w-6 h-6 text-primary mb-2" />
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Us</span>
                            <span className="text-base font-bold text-foreground mt-1 font-mono">support@labelleindfashions.com</span>
                        </div>

                        {/* Visit */}
                        <div className="flex flex-col items-center">
                            <MapPin className="w-6 h-6 text-primary mb-2" />
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Visit Us</span>
                            <span className="text-base font-bold text-foreground mt-1">Chennai, Tamil Nadu, India</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
