import axios from "axios";
import {
    getToken
} from "../auth";

const BASE_URL = process.env.REACT_APP_BACKEND_HOST
console.log(BASE_URL)
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
}, error => {
    console.log(error);
    return Promise.reject(error)
})