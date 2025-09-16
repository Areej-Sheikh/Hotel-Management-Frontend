import axios from "./axiosConfig.jsx";
import { toast } from "react-toastify";

export const getUsersService = async () => {
  try {
    const { data } = await axios.get("/admin/users");
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deleteUserService = async (id) => {
  try {
    const { data } = await axios.delete(`/admin/users/${id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getPropertiesService = async () => {
  try {
    const { data } = await axios.get("/admin/properties");
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deletePropertyService = async (id) => {
  try {
    const { data } = await axios.delete(`/admin/properties/${id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getBookingService = async () => {
  try {
    const { data } = await axios.get("/admin/bookings");
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getPaymentService = async () => {
  try {
    const { data } = await axios.get("/admin/payments");
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const getSinglePaymentService = async (id) => {
  try {
    const { data } = await axios.get(`/admin/payments/${id}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deleteBookingService = async (id) => {
  try {
    const { data } = await axios.delete(`/admin/bookings/${id}`);
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete booking.");
    throw error;
  }
};

export const viewAllPaymentsService = async () => {
  try {
    const { data } = await axios.get("/admin/payments");
    return data;
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch payments"
    );
    throw error;
  }
};
