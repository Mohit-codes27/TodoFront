"use client"

import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"
import api from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await api.get("/auth/me")
          setUser(response.data.user)
        } catch (error) {
          localStorage.removeItem("token")
          console.error("Auth check failed:", error)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setUser(user)

      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      const message = error.response?.data?.message || error.message || "Login failed"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", { name, email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setUser(user)

      toast.success("Registration successful!")
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      const message = error.response?.data?.message || error.message || "Registration failed"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.success("Logged out successfully")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
