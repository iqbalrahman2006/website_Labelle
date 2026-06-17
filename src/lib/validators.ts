import { z } from 'zod';

/**
 * Validation schemas for forms and data
 */

// User Profile Schema
export const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string()
        .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
        .optional()
        .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Address Schema
export const addressSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
    addressLine1: z.string().min(5, 'Address must be at least 5 characters').max(200),
    addressLine2: z.string().max(200).optional().or(z.literal('')),
    city: z.string().min(2, 'City is required').max(100),
    state: z.string().min(2, 'State is required').max(100),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode (must be 6 digits)'),
    country: z.string(),
    landmark: z.string().max(200).optional().or(z.literal('')),
    addressType: z.enum(['HOME', 'OFFICE', 'OTHER']),
    isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Review Schema
export const reviewSchema = z.object({
    rating: z.number().min(1, 'Rating is required').max(5),
    title: z.string().max(100).optional().or(z.literal('')),
    comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
    images: z.array(z.string()).max(5, 'Maximum 5 images allowed').optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Cart Item Schema
export const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    variantId: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 items allowed'),
});

export type AddToCartData = z.infer<typeof addToCartSchema>;

// Contact Form Schema
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional().or(z.literal('')),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
    message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Coupon Code Schema
export const couponSchema = z.object({
    code: z.string().min(3, 'Coupon code must be at least 3 characters').max(50).toUpperCase(),
});

export type CouponFormData = z.infer<typeof couponSchema>;

// Search Schema
export const searchSchema = z.object({
    query: z.string().min(1, 'Search query is required').max(100),
    category: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    sortBy: z.enum(['newest', 'price-asc', 'price-desc', 'rating', 'popularity']).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
