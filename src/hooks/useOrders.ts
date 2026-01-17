import { useQuery, UseQueryResult } from '@tanstack/react-query';

// Types
export interface OrderItem {
    id: string;
    name: string;
    sku: string;
    size?: string;
    color?: string;
    image?: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
    paymentMethod?: string;
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    shippingAddress: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
        landmark?: string;
    };
    billingAddress?: {
        name: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    trackingNumber?: string;
    carrier?: string;
    shippedAt?: string;
    deliveredAt?: string;
    notes?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface OrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface OrderFilters {
    status?: Order['status'];
    page?: number;
    pageSize?: number;
}

// Fetch orders with filters
async function fetchOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.append(key, value.toString());
        }
    });

    const response = await fetch(`/api/orders?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    return response.json();
}

// Fetch single order by ID
async function fetchOrder(orderId: string): Promise<Order> {
    const response = await fetch(`/api/orders/${orderId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return response.json();
}

// Hooks

/**
 * Hook to fetch user's orders with filters
 */
export function useOrders(filters: OrderFilters = {}): UseQueryResult<OrdersResponse> {
    return useQuery({
        queryKey: ['orders', filters],
        queryFn: () => fetchOrders(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(orderId: string): UseQueryResult<Order> {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrder(orderId),
        enabled: !!orderId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}
