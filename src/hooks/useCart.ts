import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartItem {
    id: string;
    productId: string;
    variantId?: string;
    quantity: number;
    product: {
        name: string;
        slug: string;
        price: number;
        image?: string;
    };
    variant?: {
        size?: string;
        color?: string;
        priceAdjustment: number;
    };
}

interface CartStore {
    items: CartItem[];
    isLoading: boolean;

    // Actions
    addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    syncWithServer: () => Promise<void>;

    // Computed
    itemCount: () => number;
    subtotal: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            addItem: async (item) => {
                set({ isLoading: true });

                try {
                    // Check if item already exists
                    const existingItem = get().items.find(
                        (i) => i.productId === item.productId && i.variantId === item.variantId
                    );

                    if (existingItem) {
                        // Update quantity
                        await get().updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
                        return;
                    }

                    // Add to server
                    const response = await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add item to cart');
                    }

                    const data = await response.json();

                    // Add to local state
                    set((state) => ({
                        items: [...state.items, { ...item, id: data.id }],
                    }));

                    toast.success('Added to cart', {
                        description: `${item.product.name} has been added to your cart`,
                    });
                } catch (error) {
                    console.error('Error adding item to cart:', error);
                    toast.error('Failed to add item to cart');
                } finally {
                    set({ isLoading: false });
                }
            },

            removeItem: async (itemId) => {
                set({ isLoading: true });

                try {
                    // Remove from server
                    const response = await fetch(`/api/cart/${itemId}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to remove item from cart');
                    }

                    // Remove from local state
                    set((state) => ({
                        items: state.items.filter((item) => item.id !== itemId),
                    }));

                    toast.success('Removed from cart');
                } catch (error) {
                    console.error('Error removing item from cart:', error);
                    toast.error('Failed to remove item from cart');
                } finally {
                    set({ isLoading: false });
                }
            },

            updateQuantity: async (itemId, quantity) => {
                if (quantity < 1) {
                    await get().removeItem(itemId);
                    return;
                }

                set({ isLoading: true });

                try {
                    // Update on server
                    const response = await fetch(`/api/cart/${itemId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update cart item');
                    }

                    // Update local state
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === itemId ? { ...item, quantity } : item
                        ),
                    }));
                } catch (error) {
                    console.error('Error updating cart item:', error);
                    toast.error('Failed to update cart item');
                } finally {
                    set({ isLoading: false });
                }
            },

            clearCart: async () => {
                set({ isLoading: true });

                try {
                    // Clear on server
                    const response = await fetch('/api/cart', {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to clear cart');
                    }

                    // Clear local state
                    set({ items: [] });
                    toast.success('Cart cleared');
                } catch (error) {
                    console.error('Error clearing cart:', error);
                    toast.error('Failed to clear cart');
                } finally {
                    set({ isLoading: false });
                }
            },

            syncWithServer: async () => {
                try {
                    const response = await fetch('/api/cart');

                    if (!response.ok) {
                        throw new Error('Failed to sync cart');
                    }

                    const data = await response.json();

                    // Transform server data to match local state
                    const items: CartItem[] = data.items.map((item: any) => ({
                        id: item.id,
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                        product: {
                            name: item.product.name,
                            slug: item.product.slug,
                            price: item.product.price,
                            image: item.product.images?.[0]?.url,
                        },
                        variant: item.variant ? {
                            size: item.variant.size,
                            color: item.variant.color,
                            priceAdjustment: item.variant.priceAdjustment,
                        } : undefined,
                    }));

                    set({ items });
                } catch (error) {
                    console.error('Error syncing cart:', error);
                }
            },

            itemCount: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            subtotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.product.price + (item.variant?.priceAdjustment || 0);
                    return total + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
