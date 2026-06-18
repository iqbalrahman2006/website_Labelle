"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: Date;
}

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error("Failed to update user role");
            }

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success("Role updated successfully");
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update user role");
        } finally {
            setUpdatingId(null);
        }
    };

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No users found
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Email
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Current Role
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                                Registered On
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                                Actions / Role Change
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {user.name || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    {user.email || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                                            ? "bg-purple-100 text-purple-800"
                                            : user.role === "CUSTOMER"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                    {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-end">
                                        <Select
                                            value={user.role}
                                            onValueChange={(val) => handleRoleChange(user.id, val)}
                                            disabled={updatingId === user.id}
                                        >
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">USER</SelectItem>
                                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                                                <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
