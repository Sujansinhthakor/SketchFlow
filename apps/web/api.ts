import axios from "axios";
import { authClient } from "./app/lib/auth-client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const { data } = await authClient.token();
    if (data?.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
  } catch (err) {
    console.error("Failed to attach auth token", err);
  }
  return config;
});

export default api;
