import { toast } from "react-toastify";

export const showSuccess = (msg) => toast.success(msg);
export const showError = (err) =>{
     const message = err?.response?.data?.message || "Something went wrong!";
  toast.error(message);
}