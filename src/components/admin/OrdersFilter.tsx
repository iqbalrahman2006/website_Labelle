"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function OrdersFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Local state to manage filter inputs
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [paymentStatus, setPaymentStatus] = useState(searchParams.get("paymentStatus") || "all");
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

    // Trigger URL update on change
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (search) params.set("search", search);
        else params.delete("search");

        if (status && status !== "all") params.set("status", status);
        else params.delete("status");

        if (paymentStatus && paymentStatus !== "all") params.set("paymentStatus", paymentStatus);
        else params.delete("paymentStatus");

        if (startDate) params.set("startDate", startDate);
        else params.delete("startDate");

        if (endDate) params.set("endDate", endDate);
        else params.delete("endDate");

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setPaymentStatus("all");
        setStartDate("");
        setEndDate("");
        router.push(pathname);
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Text */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Order # or Customer..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Order Status Select */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Order Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Orders" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="PACKED">Packed</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Status Select */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-600">Payment Status</Label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Payments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-600">From Date</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-600">To Date</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                    Reset
                </Button>
                <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}
