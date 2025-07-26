import axios from "axios"

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Ensure arrays are returned as arrays
    if (response.config.url?.includes("/todos/recent") && !Array.isArray(response.data)) {
      response.data = []
    }
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

export default api
