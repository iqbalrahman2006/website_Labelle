"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
    // Fetch Sarees for showcase
    const { data, isLoading } = useProducts({
        category: "sarees",
        pageSize: 4
    });

    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            toast.success("Thank you for contacting us! We will get back to you within 24 hours.");
            setForm({ name: "", email: "", message: "" });
            setSubmitting(false);
        }, 1200);
    };

    return (
        <div className="container py-12 space-y-16 min-h-screen">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-secondary font-bold uppercase tracking-widest text-xs">Reach Out</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Contact Our Boutiques</h1>
                <p className="text-muted-foreground">
                    Have questions about fabrics, custom sizing, or delivery? Our styling concierge is here to help.
                </p>
            </div>

            {/* Main Block */}
            <div className="grid md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-background border border-secondary/15 rounded-3xl p-8 shadow-sm space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-primary">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Name</label>
                            <Input 
                                placeholder="Your Name" 
                                value={form.name} 
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="border-secondary/30 focus-visible:ring-primary focus-visible:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Email Address</label>
                            <Input 
                                type="email" 
                                placeholder="name@example.com" 
                                value={form.email} 
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="border-secondary/30 focus-visible:ring-primary focus-visible:border-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Message</label>
                            <Textarea 
                                placeholder="How can we help you? (Mention custom sizing requirements here if any)" 
                                rows={5}
                                value={form.message} 
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                className="border-secondary/30 focus-visible:ring-primary focus-visible:border-primary"
                            />
                        </div>
                        <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
                            {submitting ? "Sending..." : "Submit Message"} <Send className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* Boutique Info */}
                <div className="space-y-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-foreground">Boutique Locations</h2>
                        
                        <div className="space-y-6 text-sm sm:text-base">
                            {/* Delhi Boutique */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-secondary/15 rounded-xl text-secondary flex-shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Flagship Boutique - New Delhi</h3>
                                    <p className="text-muted-foreground text-sm">D-12, Connaught Place, Inner Circle, New Delhi, 110001</p>
                                </div>
                            </div>

                            {/* Mumbai Boutique */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-secondary/15 rounded-xl text-secondary flex-shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Studio Boutique - Mumbai</h3>
                                    <p className="text-muted-foreground text-sm">Hotel Taj Mahal Palace Shopping Arcade, Colaba, Mumbai, 400001</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-secondary/15 rounded-xl text-secondary flex-shrink-0">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Styling Support Hotline</h3>
                                    <p className="text-muted-foreground text-sm">+91 11 4321 8765 / +91 22 9876 5432</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Mon - Sat, 10:00 AM - 7:00 PM IST</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-secondary/15 rounded-xl text-secondary flex-shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Email Inquiries</h3>
                                    <p className="text-muted-foreground text-sm">concierge@labelle.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-luxury-gold p-[1px] rounded-2xl shadow-md hidden md:block overflow-hidden">
                        <div className="bg-background p-6 rounded-[15px] text-center space-y-2">
                            <h4 className="font-bold font-serif text-primary">Custom Measurements</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                We stitch salwars and lehengas to your custom measurements! Place your order and drop us an email with your order ID and styling parameters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Showcase Section (INR Prices and different images) */}
            <div className="space-y-8 border-t pt-16">
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-secondary font-bold uppercase tracking-widest text-xs">Trending Now</span>
                        <h2 className="text-3xl font-serif font-bold text-foreground mt-1">Bestsellers Showcase</h2>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary/80 font-semibold" asChild>
                        <Link href="/products?category=sarees">
                            View All Sarees <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <ProductGrid 
                    products={data?.products || []} 
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
}
