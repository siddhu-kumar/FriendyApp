import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_HOST;

export const myAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

privateAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateAxios.interceptors.response.use(
  (response) => {
    console.log("intercepted response", response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response?.status === 401 && !originalRequest._retry && !originalRequest.url !== "/refresh-token") {
      console.log("401 error intercepted, refreshing token...");
      originalRequest._retry = true;
      try {
        await myAxios.post("/refresh-token", {} , { withCredentials: true });
        return privateAxios(originalRequest);
      } catch (err) {
        if (err.response && err.response?.status === 401) {
          console.log("here", err.response);
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
