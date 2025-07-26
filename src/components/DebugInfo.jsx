"use client"

import { useState, useEffect } from "react"

const DebugInfo = () => {
  const [backendStatus, setBackendStatus] = useState("checking...")
  const [frontendPort, setFrontendPort] = useState(window.location.port)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me")
        setBackendStatus("✅ Backend is running")
      } catch (error) {
        setBackendStatus("❌ Backend is not running")
      }
    }

    checkBackend()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="font-bold mb-1">Debug Info:</div>
      <div>Frontend: {window.location.origin}</div>
      <div>Backend: {backendStatus}</div>
      <div>API calls go to: http://localhost:5000/api</div>
    </div>
  )
}

export default DebugInfo
