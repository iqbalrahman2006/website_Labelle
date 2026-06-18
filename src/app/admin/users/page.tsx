import { prisma } from "@/lib/prisma";
import { UsersTable } from "@/components/admin/UsersTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchParams {
    search?: string;
}

async function getUsers(searchParams: SearchParams) {
    try {
        const users = await prisma.user.findMany({
            where: {
                ...(searchParams.search && {
                    OR: [
                        {
                            name: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: searchParams.search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }),
            },
            orderBy: { createdAt: "desc" },
        });

        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const users = await getUsers(searchParams);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Role Management</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage administrative privileges and customer accounts
                </p>
            </div>

            {/* Users Table */}
            <UsersTable users={users} />

            {/* User Count */}
            <div className="text-sm text-gray-500">
                Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
