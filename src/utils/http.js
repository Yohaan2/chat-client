import axios from 'axios';
import { BASE_URL } from './config';

const axiosInstance = axios.create({ baseURL: BASE_URL})

axiosInstance.interceptors.response.use(
  (response) =>  response.data,
  (error) => Promise.reject(error.response?.data?.message || error.response?.data?.error)
)

export default axiosInstance

export const API_ENDPOINTS = {
  register: '/api/register',
  login: '/api/login',
}