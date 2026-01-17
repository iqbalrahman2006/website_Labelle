import { prisma } from "@/lib/prisma";
import { CouponsTable } from "@/components/admin/CouponsTable";

async function getCoupons() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });
        return coupons;
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return [];
    }
}

export default async function CouponsPage() {
    const coupons = await getCoupons();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage discount coupons
                </p>
            </div>

            <CouponsTable coupons={coupons} />

            <div className="text-sm text-gray-500">
                Showing {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
