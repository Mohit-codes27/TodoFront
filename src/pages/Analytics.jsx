"use client"

import { useQuery } from "react-query"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Target, Clock, Award } from "lucide-react"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import Button from "../components/UI/Button"
import api from "../utils/api"

const Analytics = () => {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery("analytics", () => api.get("/analytics").then((res) => res.data), {
    onError: (error) => {
      console.error("Analytics fetch error:", error)
    },
  })

  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    error: monthlyError,
  } = useQuery("monthlyAnalytics", () => api.get("/analytics/monthly").then((res) => res.data), {
    onError: (error) => {
      console.error("Monthly analytics fetch error:", error)
    },
  })

  if (isLoading || monthlyLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || monthlyError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p>Error loading analytics data</p>
          <p className="text-sm">{error?.message || monthlyError?.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#6B7280"]

  const categoryChartData =
    analytics?.categoryStats?.map((item, index) => ({
      name: item._id,
      value: item.count,
      color: COLORS[index % COLORS.length],
    })) || []

  const priorityChartData =
    analytics?.priorityStats?.map((item, index) => ({
      name: item._id,
      value: item.count,
      color: COLORS[index % COLORS.length],
    })) || []

  const weeklyTrendData =
    analytics?.weeklyTrend?.map((item) => ({
      date: new Date(item._id).toLocaleDateString("en-US", { weekday: "short" }),
      completed: item.count,
    })) || []

  const stats = [
    {
      title: "This Month",
      value: `${monthlyData?.totalCreated || 0} created`,
      subtitle: `${monthlyData?.totalCompleted || 0} completed`,
      icon: Target,
      color: "bg-blue-500",
    },
    {
      title: "Completion Rate",
      value: `${analytics?.completionRate || 0}%`,
      subtitle: "Overall performance",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Average Time",
      value: `${analytics?.averageTimeSpent || 0}m`,
      subtitle: "Per completed todo",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Most Productive",
      value: analytics?.mostProductiveCategory || "None",
      subtitle: "Category",
      icon: Award,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Insights into your productivity patterns</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          {priorityChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* Weekly Completion Trend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Completion Trend</h3>
        {weeklyTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No completion data for the past week
          </div>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {analytics?.categoryStats?.map((category, index) => (
              <div key={category._id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="capitalize text-gray-700">{category._id}</span>
                </div>
                <span className="font-medium text-gray-900">{category.count} todos</span>
              </div>
            )) || <p className="text-gray-500 text-center">No data available</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
          <div className="space-y-3">
            {analytics?.priorityStats?.map((priority, index) => (
              <div key={priority._id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="capitalize text-gray-700">{priority._id}</span>
                </div>
                <span className="font-medium text-gray-900">{priority.count} todos</span>
              </div>
            )) || <p className="text-gray-500 text-center">No data available</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
