import axios from "axios";
import useStore from "../store/auth";

const BASE_URL = "https://localhost:7001/api/";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = useStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from store:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
