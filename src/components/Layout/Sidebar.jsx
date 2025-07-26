import { NavLink } from "react-router-dom"
import { LayoutDashboard, CheckSquare, BarChart3, Calendar } from "lucide-react"

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/todos", icon: CheckSquare, label: "Todos" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
  ]

  return (
    <div className="bg-white w-64 shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">TodoMaster</h1>
        </div>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : ""
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
