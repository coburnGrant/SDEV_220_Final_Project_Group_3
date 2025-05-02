// Returns the appropriate Tailwind CSS classes for a given shipment status
export const getStatusColor = (status) => {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";
        case "IN_TRANSIT":
            return "bg-blue-100 text-blue-800";
        case "DELIVERED":
            return "bg-green-100 text-green-800";
        case "CANCELLED":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

// Returns the appropriate Tailwind CSS classes for a given shipment type
export const getTypeColor = (type) => {
    return type === "IN"
        ? "bg-green-100 text-green-800"
        : "bg-blue-100 text-blue-800";
};

// Formats a shipment status for display by replacing underscores with spaces
export const formatStatus = (status) => {
    return status.replace("_", " ");
};

// Formats a date string into a localized date format
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}; 