import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1256", // Replace with your actual backend URL
});

// Add Authorization header interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
