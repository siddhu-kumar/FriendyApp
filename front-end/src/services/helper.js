import axios from "axios";
import { getToken } from "../auth";

export const BASE_URL = 'http://192.168.1.23:8000'

export const myAxios = axios.create({
    baseURL: BASE_URL
});

export const privateAxios = axios.create({
    baseURL: BASE_URL
});

privateAxios.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token.token}`
    }
    return config
}, error => { return Promise.reject(error) })