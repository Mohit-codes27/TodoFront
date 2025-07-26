"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check, Clock, Edit, Trash2, Calendar, AlertCircle, Timer } from "lucide-react"
import Button from "../UI/Button"

const TodoItem = ({ todo, onToggle, onEdit, onDelete, onUpdateTime }) => {
  const [timeSpent, setTimeSpent] = useState(todo.timeSpent || 0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerInterval, setTimerInterval] = useState(null)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
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

  const startTimer = () => {
    setIsTimerRunning(true)
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 60000) // Update every minute
    setTimerInterval(interval)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    onUpdateTime(todo._id, timeSpent)
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${todo.completed ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(todo._id, !todo.completed)}
            className={`mt-1 p-1 rounded-full transition-colors ${
              todo.completed
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
            }`}
          >
            <Check className="h-4 w-4" />
          </button>

          <div className="flex-1">
            <h3 className={`font-medium ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {todo.title}
            </h3>

            {todo.description && <p className="text-gray-600 text-sm mt-1">{todo.description}</p>}

            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(todo.category)}`}>
                {todo.category}
              </span>

              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </span>

              {todo.dueDate && (
                <div className={`flex items-center space-x-1 text-xs ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
                  {isOverdue && <AlertCircle className="h-3 w-3" />}
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(todo.dueDate), "MMM dd, yyyy HH:mm")}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Created: {format(new Date(todo.createdAt), "MMM dd, yyyy")}</span>
              </div>

              {todo.completedAt && (
                <div className="flex items-center space-x-1">
                  <Check className="h-3 w-3" />
                  <span>Completed: {format(new Date(todo.completedAt), "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>

            {/* Time tracking */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Timer className="h-4 w-4" />
                <span>Time: {formatTime(timeSpent)}</span>
              </div>

              {!todo.completed && (
                <Button
                  size="small"
                  variant={isTimerRunning ? "danger" : "secondary"}
                  onClick={isTimerRunning ? stopTimer : startTimer}
                >
                  {isTimerRunning ? "Stop" : "Start"} Timer
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(todo)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Edit className="h-4 w-4" />
          </button>

          <button onClick={() => onDelete(todo._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoItem
