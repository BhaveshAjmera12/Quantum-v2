import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
     withCredentials: true, // This is necessary to receive/send cookies
})

export default axiosInstance