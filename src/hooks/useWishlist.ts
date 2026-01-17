import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface WishlistItem {
    id: string;
    productId: string;
    product: {
        name: string;
        slug: string;
        price: number;
        compareAtPrice?: number;
        image?: string;
    };
}

interface WishlistStore {
    items: WishlistItem[];
    isLoading: boolean;

    // Actions
    addItem: (productId: string, product: WishlistItem['product']) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    toggleItem: (productId: string, product: WishlistItem['product']) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    syncWithServer: () => Promise<void>;

    // Computed
    itemCount: () => number;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: async (productId, product) => {
                // Check if already in wishlist
                if (get().isInWishlist(productId)) {
                    toast.info('Already in wishlist');
                    return;
                }

                set({ isLoading: true });

                try {
                    // Add to server
                    const response = await fetch('/api/wishlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add item to wishlist');
                    }

                    const data = await response.json();

                    // Add to local state
                    set((state) => ({
                        items: [...state.items, { id: data.id, productId, product }],
                    }));

                    toast.success('Added to wishlist', {
                        description: `${product.name} has been added to your wishlist`,
                    });
                } catch (error) {
                    console.error('Error adding item to wishlist:', error);
                    toast.error('Failed to add item to wishlist');
                } finally {
                    set({ isLoading: false });
                }
            },

            removeItem: async (itemId) => {
                set({ isLoading: true });

                try {
                    // Remove from server
                    const response = await fetch(`/api/wishlist/${itemId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to remove item from wishlist');
                    }

                    // Remove from local state
                    set((state) => ({
                        items: state.items.filter((item) => item.id !== itemId),
                    }));

                    toast.success('Removed from wishlist');
                } catch (error) {
                    console.error('Error removing item from wishlist:', error);
                    toast.error('Failed to remove item from wishlist');
                } finally {
                    set({ isLoading: false });
                }
            },

            toggleItem: async (productId, product) => {
                const existingItem = get().items.find((item) => item.productId === productId);

                if (existingItem) {
                    await get().removeItem(existingItem.id);
                } else {
                    await get().addItem(productId, product);
                }
            },

            isInWishlist: (productId) => {
                return get().items.some((item) => item.productId === productId);
            },

            syncWithServer: async () => {
                try {
                    const response = await fetch('/api/wishlist');

                    if (!response.ok) {
                        throw new Error('Failed to sync wishlist');
                    }

                    const data = await response.json();

                    // Transform server data to match local state
                    const items: WishlistItem[] = data.items.map((item: any) => ({
                        id: item.id,
                        productId: item.productId,
                        product: {
                            name: item.product.name,
                            slug: item.product.slug,
                            price: item.product.price,
                            compareAtPrice: item.product.compareAtPrice,
                            image: item.product.images?.[0]?.url,
                        },
                    }));

                    set({ items });
                } catch (error) {
                    console.error('Error syncing wishlist:', error);
                }
            },

            itemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
