import axios from "axios";

const API_VERSION = "/api/v1";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: BASE_URL + API_VERSION,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
