import axios from "axios";
import { getToken } from "@clerk/clerk-react";

const axiosInstance = axios.create({
  baseURL: "https://talent-iq-backend-vkpm.onrender.com/api",
});

// Attach Clerk JWT to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
