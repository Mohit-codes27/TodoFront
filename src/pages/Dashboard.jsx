"use client"

import { useQuery } from "react-query"
import { format } from "date-fns"
import { CheckSquare, Clock, TrendingUp, Calendar, Plus, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import Button from "../components/UI/Button"
import api from "../utils/api"

const Dashboard = () => {
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery("analytics", () => api.get("/analytics").then((res) => res.data), {
    retry: 1,
    onError: (error) => {
      console.error("Analytics fetch error:", error)
    },
  })

  const {
    data: recentTodos,
    isLoading: todosLoading,
    error: todosError,
  } = useQuery(
    "recentTodos",
    () => api.get("/todos/recent").then((res) => Array.isArray(res.data) ? res.data : []),
    {
      retry: 1,
      onError: (error) => {
        console.error("Recent todos fetch error:", error)
      },
    },
  )

  if (analyticsLoading || todosLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (analyticsError || todosError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p>Error loading dashboard data</p>
          <p className="text-sm">{analyticsError?.message || todosError?.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const stats = [
    { title: "Total Todos", value: analytics?.totalTodos || 0, icon: CheckSquare, color: "bg-blue-500" },
    { title: "Completed", value: analytics?.completedTodos || 0, icon: CheckSquare, color: "bg-green-500" },
    { title: "Pending", value: analytics?.pendingTodos || 0, icon: Clock, color: "bg-yellow-500" },
    { title: "Completion Rate", value: `${analytics?.completionRate || 0}%`, icon: TrendingUp, color: "bg-purple-500" },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100"
      case "medium": return "text-yellow-600 bg-yellow-100"
      case "low": return "text-green-600 bg-green-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      work: "text-blue-600 bg-blue-100",
      personal: "text-purple-600 bg-purple-100",
      shopping: "text-pink-600 bg-pink-100",
      health: "text-green-600 bg-green-100",
      education: "text-indigo-600 bg-indigo-100",
      other: "text-gray-600 bg-gray-100",
    }
    return colors[category] || colors.other
  }

  const safeTodos = Array.isArray(recentTodos) ? recentTodos : []

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Overview of your productivity</p>
        </div>
        <Link to="/todos">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Todo
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most Productive Category:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(analytics?.mostProductiveCategory)}`}>
                {analytics?.mostProductiveCategory || "None"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Time per Todo:</span>
              <span className="font-medium text-gray-900">{analytics?.averageTimeSpent || 0} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-medium text-gray-900">{analytics?.completionRate || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {analytics?.categoryStats?.slice(0, 5)?.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(cat._id)}`}>
                  {cat._id}
                </span>
                <span className="font-medium text-gray-900">{cat.count}</span>
              </div>
            )) || <p className="text-gray-500 text-center">No data available</p>}
          </div>
        </div>
      </div>

      {/* Recent Todos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Recent Todos</h3>
          <Link to="/todos" className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="p-4 sm:p-6">
          {safeTodos.length > 0 ? (
            <div className="space-y-4">
              {safeTodos.slice(0, 5).map((todo) => (
                <div key={todo._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 mt-1 rounded-full ${todo.completed ? "bg-green-500" : "bg-gray-300"}`} />
                    <div>
                      <h4 className={`font-medium break-words ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {todo.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                          {todo.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">{format(new Date(todo.createdAt), "MMM dd")}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{todosLoading ? "Loading recent todos..." : "No recent todos found"}</p>
              <Link to="/todos">
                <Button className="mt-4">Create Your First Todo</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
