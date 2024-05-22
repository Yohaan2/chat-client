import axios, { API_ENDPOINTS } from '../utils/http'

export const register = async (data) => {
  return await axios.post(API_ENDPOINTS.register, data)
}

export const login = async (data) => {
  return await axios.post(API_ENDPOINTS.login, data)
}