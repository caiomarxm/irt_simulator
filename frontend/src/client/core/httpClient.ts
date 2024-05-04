import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpClient.interceptors.request.use((request) => {
  if (request.url?.includes("/login")) return request

  request.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`

  return request
});
