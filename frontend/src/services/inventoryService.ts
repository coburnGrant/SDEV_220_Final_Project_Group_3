import api from './api';

const INVENTORY_URL = 'api/inventory';

export const inventoryService = {
    // Get all inventory items
    getAll: async () => {
        const response = await api.get(`${INVENTORY_URL}/`);
        return response.data;
    },

    // Get a single inventory item by ID
    getById: async (id) => {
        const response = await api.get(`${INVENTORY_URL}/${id}/`);
        return response.data;
    },

    // Create a new inventory item
    create: async (data) => {
        const response = await api.post(INVENTORY_URL, data);
        return response.data;
    },

    // Update an inventory item
    update: async (id, data) => {
        const response = await api.put(`${INVENTORY_URL}/${id}/`, data);
        return response.data;
    },

    // Partially update an inventory item
    partialUpdate: async (id, data) => {
        const response = await api.patch(`${INVENTORY_URL}/${id}/`, data);
        return response.data;
    },

    // Delete an inventory item
    delete: async (id) => {
        await api.delete(`${INVENTORY_URL}/${id}/`);
    },

    // Get all categories
    getCategories: async () => {
        const response = await api.get(`${INVENTORY_URL}/categories/`);
        return response.data;
    },

    // Get low stock items
    getLowStock: async () => {
        const response = await api.get(`${INVENTORY_URL}/low_stock/`);
        return response.data;
    },

    // Search inventory items
    search: async (query) => {
        const response = await api.get(`${INVENTORY_URL}/`, {
            params: { search: query }
        });
        return response.data;
    },

    // Filter inventory items by category
    filterByCategory: async (category) => {
        const response = await api.get(`${INVENTORY_URL}/`, {
            params: { category }
        });
        return response.data;
    }
}; 