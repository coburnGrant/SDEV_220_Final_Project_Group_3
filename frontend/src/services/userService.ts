import api from "./api";

const USER_URL = "api/users";

export const userService = {
  // Get all users (admin only)
  getAll: async () => {
    const response = await api.get(`${USER_URL}/`);
    return response.data;
  },

  // Get current user
  getCurrent: async () => {
    const response = await api.get(`api/user/me/`);
    return response.data;
  },

  // Register a new user
  register: async (data) => {
    const response = await api.post(`${USER_URL}/register/`, data);
    return response.data;
  },

  // Delete a user (admin only)
  delete: async (id) => {
    await api.delete(`${USER_URL}/${id}/`);
  },
};
