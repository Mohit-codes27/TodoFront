"use client"
import { useAuth } from "../../contexts/AuthContext"
import { LogOut, User } from "lucide-react"

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full">
      <div className="px-4 md:px-6 py-4">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">Welcome back!</h2>
        <p className="text-sm text-gray-600">Manage your tasks efficiently</p>
      </div>
    </header>
  )
}

export default Header
