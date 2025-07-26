"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"

const ApiStatus = () => {
  const [status, setStatus] = useState("checking...")

  useEffect(() => {
    const checkApi = async () => {
      try {
        await api.get("/auth/me")
        setStatus("✅ API Connected")
      } catch (error) {
        if (error.response?.status === 401) {
          setStatus("✅ API Connected (not authenticated)")
        } else {
          setStatus("❌ API Connection Failed")
        }
      }
    }

    checkApi()
  }, [])

  return <div className="fixed top-4 right-4 bg-black text-white px-3 py-1 rounded text-xs">{status}</div>
}

export default ApiStatus
