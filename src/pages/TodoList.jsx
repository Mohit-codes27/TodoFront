"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import TodoItem from "../components/Todo/TodoItem"
import TodoForm from "../components/Todo/TodoForm"
import TodoFilters from "../components/Todo/TodoFilters"
import Modal from "../components/UI/Modal"
import Button from "../components/UI/Button"
import LoadingSpinner from "../components/UI/LoadingSpinner"
import api from "../utils/api"

const TodoList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priority: "",
    completed: "",
  })
  const [page, setPage] = useState(1)

  const queryClient = useQueryClient()

  // Fetch todos with filters
  const {
    data: todosData,
    isLoading,
    error,
  } = useQuery(
    ["todos", filters, page],
    () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      params.append("page", page)
      params.append("limit", "10")

      return api.get(`/todos?${params}`).then((res) => res.data)
    },
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Failed to fetch todos:", error)
        toast.error("Failed to load todos")
      },
    },
  )

  // Create todo mutation
  const createTodoMutation = useMutation((todoData) => api.post("/todos", todoData), {
    onSuccess: () => {
      queryClient.invalidateQueries("todos")
      queryClient.invalidateQueries("analytics")
      queryClient.invalidateQueries("recentTodos")
      setIsCreateModalOpen(false)
      toast.success("Todo created successfully!")
    },
    onError: (error) => {
      console.error("Create todo error:", error)
      toast.error(error.response?.data?.message || "Failed to create todo")
    },
  })

  // Update todo mutation
  const updateTodoMutation = useMutation(({ id, data }) => api.put(`/todos/${id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("todos")
      queryClient.invalidateQueries("analytics")
      queryClient.invalidateQueries("recentTodos")
      setEditingTodo(null)
      toast.success("Todo updated successfully!")
    },
    onError: (error) => {
      console.error("Update todo error:", error)
      toast.error(error.response?.data?.message || "Failed to update todo")
    },
  })

  // Delete todo mutation
  const deleteTodoMutation = useMutation((id) => api.delete(`/todos/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries("todos")
      queryClient.invalidateQueries("analytics")
      queryClient.invalidateQueries("recentTodos")
      toast.success("Todo deleted successfully!")
    },
    onError: (error) => {
      console.error("Delete todo error:", error)
      toast.error(error.response?.data?.message || "Failed to delete todo")
    },
  })

  const handleCreateTodo = (data) => {
    createTodoMutation.mutate(data)
  }

  const handleUpdateTodo = (data) => {
    updateTodoMutation.mutate({ id: editingTodo._id, data })
  }

  const handleToggleTodo = (id, completed) => {
    updateTodoMutation.mutate({ id, data: { completed } })
  }

  const handleDeleteTodo = (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      deleteTodoMutation.mutate(id)
    }
  }

  const handleUpdateTime = (id, timeSpent) => {
    updateTodoMutation.mutate({ id, data: { timeSpent } })
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p>Error loading todos</p>
          <p className="text-sm">{error.message}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  // Ensure todos is always an array
  const todos = Array.isArray(todosData?.todos) ? todosData.todos : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
          <p className="text-gray-600">
            {todosData?.total || 0} todos total, {todos.filter((t) => !t.completed).length || 0} pending
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Button>
      </div>

      {/* Filters */}
      <TodoFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Todo List */}
      <div className="space-y-4">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handleToggleTodo}
              onEdit={setEditingTodo}
              onDelete={handleDeleteTodo}
              onUpdateTime={handleUpdateTime}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters or create a new todo"
                : "Get started by creating your first todo"}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Todo</Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {todosData?.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-700">
            Page {page} of {todosData.totalPages}
          </span>
          <Button variant="outline" disabled={page === todosData.totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* Create Todo Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Todo">
        <TodoForm onSubmit={handleCreateTodo} loading={createTodoMutation.isLoading} />
      </Modal>

      {/* Edit Todo Modal */}
      <Modal isOpen={!!editingTodo} onClose={() => setEditingTodo(null)} title="Edit Todo">
        {editingTodo && (
          <TodoForm onSubmit={handleUpdateTodo} initialData={editingTodo} loading={updateTodoMutation.isLoading} />
        )}
      </Modal>
    </div>
  )
}

export default TodoList
