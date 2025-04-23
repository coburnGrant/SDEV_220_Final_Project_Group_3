import api from './api';

const AUTH_URL = 'api/token';

const authService = {
    // Refresh token
    refreshToken: async (refresh) => {
        const response = await api.post(`${AUTH_URL}/refresh/`, { refresh });
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post(`${AUTH_URL}/`, credentials);
        return response.data;
    }
};

export default authService;
