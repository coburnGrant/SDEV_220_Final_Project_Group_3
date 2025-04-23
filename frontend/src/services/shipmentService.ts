import api from './api';

export const shipmentService = {
    // Get all shipments
    getAll: async () => {
        const response = await api.get('/shipments/');
        return response.data;
    },

    // Get a single shipment by ID
    getById: async (id) => {
        const response = await api.get(`/shipments/${id}/`);
        return response.data;
    },

    // Create a new shipment
    create: async (data) => {
        const response = await api.post('/shipments/', data);
        return response.data;
    },

    // Update a shipment
    update: async (id, data) => {
        const response = await api.put(`/shipments/${id}/`, data);
        return response.data;
    },

    // Partially update a shipment
    partialUpdate: async (id, data) => {
        const response = await api.patch(`/shipments/${id}/`, data);
        return response.data;
    },

    // Delete a shipment
    delete: async (id) => {
        await api.delete(`/shipments/${id}/`);
    },

    // Update shipment status
    updateStatus: async (id, status) => {
        const response = await api.post(`/shipments/${id}/update_status/`, { status });
        return response.data;
    },

    // Filter shipments by type
    filterByType: async (type) => {
        const response = await api.get('/shipments/', {
            params: { type }
        });
        return response.data;
    },

    // Filter shipments by status
    filterByStatus: async (status) => {
        const response = await api.get('/shipments/', {
            params: { status }
        });
        return response.data;
    },

    // Search shipments
    search: async (query) => {
        const response = await api.get('/shipments/', {
            params: { search: query }
        });
        return response.data;
    }
}; 