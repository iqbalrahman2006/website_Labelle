"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Review {
    id: string;
    rating: number;
    title: string | null;
    comment: string;
    status: string;
    createdAt: Date;
    user: { name: string | null; email: string | null };
    product: { name: string };
}

interface ReviewsTableProps {
    reviews: Review[];
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
    const router = useRouter();

    const handleApprove = async (reviewId: string) => {
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "APPROVED" }),
            });

            if (!response.ok) throw new Error("Failed to approve review");

            toast.success("Review approved");
            router.refresh();
        } catch (error) {
            toast.error("Failed to approve review");
        }
    };

    const handleReject = async (reviewId: string) => {
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "REJECTED" }),
            });

            if (!response.ok) throw new Error("Failed to reject review");

            toast.success("Review rejected");
            router.refresh();
        } catch (error) {
            toast.error("Failed to reject review");
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No reviews found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                    <div key={review.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <StatusBadge status={review.status} />
                                </div>
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    {review.product.name}
                                </p>
                                {review.title && (
                                    <p className="text-sm font-semibold text-gray-900 mb-2">
                                        {review.title}
                                    </p>
                                )}
                                <p className="text-sm text-gray-700 mb-3">
                                    {review.comment}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{review.user.name || "Anonymous"}</span>
                                    <span>•</span>
                                    <span>
                                        {format(new Date(review.createdAt), "MMM dd, yyyy")}
                                    </span>
                                </div>
                            </div>
                            {review.status === "PENDING" && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApprove(review.id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReject(review.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
