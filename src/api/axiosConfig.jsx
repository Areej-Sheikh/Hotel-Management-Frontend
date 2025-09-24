import axios from "axios";

const instance = axios.create({
  baseURL: "https://hotel-management-backend-wxi5.onrender.com/api",
  withCredentials: true,
});

export default instance;
