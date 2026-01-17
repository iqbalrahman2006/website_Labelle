interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-green-100 text-green-800";
            case "DRAFT":
                return "bg-gray-100 text-gray-800";
            case "ARCHIVED":
                return "bg-yellow-100 text-yellow-800";
            case "OUT_OF_STOCK":
                return "bg-red-100 text-red-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "SHIPPED":
                return "bg-purple-100 text-purple-800";
            case "PROCESSING":
                return "bg-yellow-100 text-yellow-800";
            case "CONFIRMED":
                return "bg-blue-100 text-blue-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "PENDING":
                return "bg-gray-100 text-gray-800";
            case "PAID":
                return "bg-green-100 text-green-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                status
            )}`}
        >
            {status.replace(/_/g, " ")}
        </span>
    );
}
