import axios from "axios";

// const API = "/api/v1/users";
const API = "http://52.204.186.98:5000/api/v1/users"; 

export const loginUser = async (userData) => {
  const response = await axios.post(`${API}/login`, userData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};
