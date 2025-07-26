"use client"

import { useState } from "react"

const ConnectionTest = () => {
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus("Testing connection...")

    try {
      // Test direct connection to backend
      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setStatus("✅ Backend connection successful!")
      } else {
        setStatus(`❌ Backend responded with status: ${response.status}`)
      }
    } catch (error) {
      console.error("Connection test failed:", error)
      setStatus(`❌ Connection failed: ${error.message}`)

      // Check if backend is running
      if (error.message.includes("fetch")) {
        setStatus((prev) => prev + "\n\n🔍 Make sure your backend server is running on port 5000")
        setStatus((prev) => prev + "\nRun: cd backend && npm run server")
      }
    }

    setLoading(false)
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-medium text-yellow-800 mb-2">Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Backend Connection"}
      </button>
      {status && <pre className="mt-2 text-sm text-yellow-700 whitespace-pre-wrap">{status}</pre>}
    </div>
  )
}

export default ConnectionTest
