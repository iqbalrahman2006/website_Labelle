import { prisma } from "@/lib/prisma";
import { ReviewsTable } from "@/components/admin/ReviewsTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SearchParams {
    status?: string;
}

async function getReviews(searchParams: SearchParams) {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                ...(searchParams.status && { status: searchParams.status as any }),
            },
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}

export default async function ReviewsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const reviews = await getReviews(searchParams);
    const pendingCount = reviews.filter((r) => r.status === "PENDING").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Moderate product reviews
                        {pendingCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {pendingCount} pending
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-4">
                <Select defaultValue={searchParams.status || "all"}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ReviewsTable reviews={reviews} />

            <div className="text-sm text-gray-500">
                Showing {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
