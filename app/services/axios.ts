import axios from "axios";
import config from "../config/config";

const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default apiClient;
