import api from "./api";

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data; // { token, user }
};

// Register user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};
