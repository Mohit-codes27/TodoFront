import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Calendar,
  LogOut,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ closeSidebar }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/todos", icon: CheckSquare, label: "Todos" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="bg-white w-64 min-h-screen flex flex-col justify-between shadow-lg">
      <div>
        {/* Logo */}

        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">TodoMaster</h1>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-red-500"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 pb-2 text-sm text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium truncate">{user.name}</span>
            </div>
            <div className="truncate text-xs text-gray-500">{user.email}</div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : ""
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full text-left space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
