"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface Review {
    id: string;
    rating: number;
    title?: string;
    comment: string;
    images: string[];
    isVerified: boolean;
    createdAt: string;
    user: {
        name?: string;
        image?: string;
    };
}

interface ReviewSectionProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    onWriteReview?: () => void;
}

export function ReviewSection({
    reviews,
    averageRating,
    totalReviews,
    onWriteReview,
}: ReviewSectionProps) {
    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter((r) => r.rating === rating).length;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        return { rating, count, percentage };
    });

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-lg">
                    <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-6 w-6",
                                    i < Math.floor(averageRating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-3">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-20">
                                <span className="text-sm font-medium">{rating}</span>
                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            </div>
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-400 transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Button */}
            {onWriteReview && (
                <div className="flex justify-center">
                    <Button onClick={onWriteReview} size="lg">
                        Write a Review
                    </Button>
                </div>
            )}

            <Separator />

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Customer Reviews</h3>

                {reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="border rounded-lg p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarImage src={review.user.image} />
                        <AvatarFallback>
                            {review.user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.user.name || 'Anonymous'}</span>
                            {review.isVerified && (
                                <Badge variant="secondary" className="text-xs">
                                    Verified Purchase
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-4 w-4",
                                            i < review.rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
                {review.title && (
                    <h4 className="font-semibold">{review.title}</h4>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                </p>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {review.images.map((image, index) => (
                        <div
                            key={index}
                            className="relative h-20 w-20 rounded-md overflow-hidden border"
                        >
                            <img
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
