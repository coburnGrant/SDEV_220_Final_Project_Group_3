import api from './api';

export const inventoryService = {
    // Get all inventory items
    getAll: async () => {
        const response = await api.get('/inventory/');
        return response.data;
    },

    // Get a single inventory item by ID
    getById: async (id) => {
        const response = await api.get(`/inventory/${id}/`);
        return response.data;
    },

    // Create a new inventory item
    create: async (data) => {
        const response = await api.post('/inventory/', data);
        return response.data;
    },

    // Update an inventory item
    update: async (id, data) => {
        const response = await api.put(`/inventory/${id}/`, data);
        return response.data;
    },

    // Partially update an inventory item
    partialUpdate: async (id, data) => {
        const response = await api.patch(`/inventory/${id}/`, data);
        return response.data;
    },

    // Delete an inventory item
    delete: async (id) => {
        await api.delete(`/inventory/${id}/`);
    },

    // Get all categories
    getCategories: async () => {
        const response = await api.get('/inventory/categories/');
        return response.data;
    },

    // Get low stock items
    getLowStock: async () => {
        const response = await api.get('/inventory/low_stock/');
        return response.data;
    },

    // Search inventory items
    search: async (query) => {
        const response = await api.get('/inventory/', {
            params: { search: query }
        });
        return response.data;
    },

    // Filter inventory items by category
    filterByCategory: async (category) => {
        const response = await api.get('/inventory/', {
            params: { category }
        });
        return response.data;
    }
}; 