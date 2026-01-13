import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://talent-iq-backend-vkpm.onrender.com/api",
  withCredentials: true, 
});

export default axiosInstance;
