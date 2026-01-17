"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    user: {
        name?: string | null;
        role?: string | null;
    };
}

export function AdminHeader({ user }: AdminHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <div>
                <h1 className="text-xl font-semibold text-gray-900">
                    Welcome back, {user.name || "Admin"}
                </h1>
                <p className="text-sm text-gray-500">
                    {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                </p>
            </div>

            <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Store
                </Button>
            </Link>
        </header>
    );
}
