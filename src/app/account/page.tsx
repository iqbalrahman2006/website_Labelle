"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/account/ProfileForm";
import { OrderCard } from "@/components/account/OrderCard";
import { AddressCard } from "@/components/account/AddressCard";
import { WishlistGrid } from "@/components/account/WishlistGrid";
import { useSession } from "next-auth/react";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const { data: ordersData, isLoading: ordersLoading } = useOrders({ pageSize: 5 });
    const { items: wishlistItems, syncWithServer } = useWishlist();
    const [addresses, setAddresses] = useState<any[]>([]);

    useEffect(() => {
        syncWithServer();
    }, [syncWithServer]);

    if (status === "loading") {
        return (
            <div className="container py-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        redirect("/login");
    }

    const handleProfileSubmit = async (data: any) => {
        // TODO: Implement profile update API call
        console.log("Profile update:", data);
    };

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold mb-2">My Account</h1>
                <p className="text-muted-foreground">
                    Manage your profile, orders, and preferences
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-8">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="addresses">Addresses</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
                        <div className="border rounded-lg p-6">
                            <ProfileForm
                                defaultValues={{
                                    name: session?.user?.name || "",
                                    email: session?.user?.email || "",
                                    phone: "",
                                }}
                                onSubmit={handleProfileSubmit}
                            />
                        </div>
                    </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Order History</h2>
                    </div>

                    {ordersLoading ? (
                        <div className="grid gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : ordersData && ordersData.orders.length > 0 ? (
                        <div className="grid gap-6">
                            {ordersData.orders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground mb-4">No orders yet</p>
                            <a href="/products" className="text-primary hover:underline">
                                Start shopping
                            </a>
                        </div>
                    )}
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Saved Addresses</h2>
                    </div>

                    <div className="text-center py-16">
                        <p className="text-muted-foreground">Address management coming soon</p>
                    </div>
                </TabsContent>

                {/* Wishlist Tab */}
                <TabsContent value="wishlist" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">My Wishlist</h2>
                        <p className="text-sm text-muted-foreground">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>

                    <WishlistGrid items={wishlistItems} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
