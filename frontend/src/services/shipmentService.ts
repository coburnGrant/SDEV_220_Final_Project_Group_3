import api from './api';

const SHIPMENT_URL = 'api/shipments';
export const shipmentService = {
    // Get all shipments
    getAll: async () => {
        const response = await api.get(`${SHIPMENT_URL}/`);
        return response.data;
    },

    // Get recent shipments (last 30 days)
    getRecent: async () => {
        const response = await api.get(`${SHIPMENT_URL}/recent/`);
        return response.data;
    },

    // Get a single shipment by ID
    getById: async (id) => {
        const response = await api.get(`${SHIPMENT_URL}/${id}/`);
        return response.data;
    },

    // Create a new shipment
    create: async (data) => {
        const response = await api.post(`${SHIPMENT_URL}/`, data);
        return response.data;
    },

    // Update a shipment
    update: async (id, data) => {
        const response = await api.put(`${SHIPMENT_URL}/${id}/`, data);
        return response.data;
    },

    // Partially update a shipment
    partialUpdate: async (id, data) => {
        const response = await api.patch(`${SHIPMENT_URL}/${id}/`, data);
        return response.data;
    },

    // Delete a shipment
    delete: async (id) => {
        await api.delete(`${SHIPMENT_URL}/${id}/`);
    },

    // Update shipment status
    updateStatus: async (id, status) => {
        const response = await api.post(`${SHIPMENT_URL}/${id}/update_status/`, { status });
        return response.data;
    },

    // Filter shipments by type
    filterByType: async (type) => {
        const response = await api.get(`${SHIPMENT_URL}/`, {
            params: { type }
        });
        return response.data;
    },

    // Filter shipments by status
    filterByStatus: async (status) => {
        const response = await api.get(`${SHIPMENT_URL}/`, {
            params: { status }
        });
        return response.data;
    },

    // Search shipments
    search: async (query) => {
        const response = await api.get(`${SHIPMENT_URL}/`, {
            params: { search: query }
        });
        return response.data;
    },

    // Get shipment history for an item
    getItemHistory: async (itemId) => {
        try {
            const response = await api.get(`${SHIPMENT_URL}/item_history/?item_id=${itemId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Failed to fetch shipment history" };
        }
    }
}; 