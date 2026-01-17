/**
 * Utility functions for formatting data
 */

/**
 * Format number as Indian Rupee currency
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
}

/**
 * Format date to short format (DD/MM/YYYY)
 */
export function formatDateShort(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(dateObj);
}

/**
 * Format rating to 1 decimal place
 */
export function formatRating(rating: number): string {
    return rating.toFixed(1);
}

/**
 * Format review count with proper pluralization
 */
export function formatReviewCount(count: number): string {
    if (count === 0) return 'No reviews';
    if (count === 1) return '1 review';
    return `${count.toLocaleString('en-IN')} reviews`;
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatCompactNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(price: number, compareAtPrice: number): number {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Format discount percentage
 */
export function formatDiscount(price: number, compareAtPrice: number): string {
    const discount = calculateDiscountPercentage(price, compareAtPrice);
    return discount > 0 ? `${discount}% OFF` : '';
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format phone number (Indian format)
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as +91 XXXXX XXXXX
    if (cleaned.length === 10) {
        return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }

    return phone;
}

/**
 * Format order number
 */
export function formatOrderNumber(orderNumber: string): string {
    return `#${orderNumber}`;
}
