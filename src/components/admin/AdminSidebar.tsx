"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    Star,
    Tag,
    Settings,
    LogOut,
    Boxes,
    UserCog,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    };
}

const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Boxes,
    },
    {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: UserCog,
    },
    {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
    },
    {
        label: "Coupons",
        href: "/admin/coupons",
        icon: Tag,
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">LB</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900">
                        LA BELLE Admin
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback>
                            {user.name?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
