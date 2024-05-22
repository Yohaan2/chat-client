import axios, { API_ENDPOINTS } from "../utils/http"

export const getUser = async () => {
  return await axios.get(API_ENDPOINTS.getUser, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
}