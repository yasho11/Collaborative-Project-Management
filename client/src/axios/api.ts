import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: "http://localhost:1256",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
