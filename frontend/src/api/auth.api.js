import axiosInstance from "../config/axios";

export const loginUser = (data) => axiosInstance.post('/users/login',data)
export const registerUser = (data) => axiosInstance.post('/users/register',data)