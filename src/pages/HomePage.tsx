// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodoService, Todo } from "../context/TodoServiceContext";
// --- Import TodoList ---
import TodoList from "../components/TodoList";
// --- ----------------- ---
import AddTodoForm from "../components/AddTodoForm";
// Removed useNavigate as it's not used here currently

const HomePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const service = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    // Add logs for debugging
    console.log("HomePage: fetchTodos called.");

    if (!currentUser) {
      console.log("HomePage: No current user found in fetchTodos.");
      setLoadingTodos(false); // Set loading false if no user
      setTodos([]); // Clear any existing todos if user logs out
      return;
    }

    console.log(`HomePage: Attempting fetch for user: ${currentUser.uid}`);
    setLoadingTodos(true); // Start loading
    setError(null); // Clear previous errors

    try {
      console.log("HomePage: Calling service.getTodosForUser...");
      // Use service.getTodosForUser from context
      const userTodos = await service.getTodosForUser(currentUser.uid);
      console.log(`HomePage: Fetched ${userTodos.length} todos.`);
      setTodos(userTodos); // Update state with fetched todos
    } catch (err) {
      console.error("HomePage: Failed to fetch todos:", err);
      setError("Could not load your tasks. Please try again later.");
      setTodos([]); // Clear todos on error
    } finally {
      // CRUCIAL: Always set loading to false after attempt
      console.log("HomePage: Setting loadingTodos to false in finally block.");
      setLoadingTodos(false);
    }
  }, [currentUser, service]); // Dependencies: currentUser and service

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // --- Define Handler for Toggling Completion ---
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    console.log(`Toggling completion for todo: ${id}`);
    setError(null); // Clear previous errors
    // Optimistic UI update (optional but good UX)
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id ? { ...t, isCompleted: !currentStatus } : t
      )
    );
    try {
      await service.updateTodo(id, { isCompleted: !currentStatus });
      // Optional: Re-fetch to confirm, or rely on optimistic update
      // await fetchTodos();
    } catch (err) {
      console.error("Failed to toggle complete:", err);
      setError("Failed to update task status. Please try again.");
      // Revert optimistic update on failure
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === id ? { ...t, isCompleted: currentStatus } : t
        )
      );
    }
  };

  // --- Define Handler for Deleting ---
  const handleDelete = async (id: string) => {
    console.log(`Deleting todo: ${id}`);
    setError(null);
    // Optimistic UI update
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    try {
      await service.deleteTodo(id);
      // Optional: Re-fetch or rely on optimistic update
      // await fetchTodos();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete task. Please try again.");
      // Revert optimistic update on failure (requires fetching original list again)
      // Consider simply showing error and letting user retry or refresh
      await fetchTodos(); // Re-fetch to restore list on delete failure
    }
  };

  const handleLogout = async () => {
    /* ... no change needed ... */
  };

  return (
    <div>
      <h1>ToDo List</h1>
      {/* ... user info and logout button ... */}
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Log Out
      </button>
      <hr />
      <h2>Add New Task</h2>
      <AddTodoForm onTodoAdded={fetchTodos} />
      <hr style={{ margin: "20px 0" }} />
      <h2>Your Tasks</h2>

      {/* --- Render TodoList instead of direct mapping --- */}
      <TodoList
        todos={todos}
        loading={loadingTodos}
        error={error}
        onToggleComplete={handleToggleComplete} // Pass handler
        onDelete={handleDelete} // Pass handler
      />
      {/* --- ---------------------------------------- --- */}
    </div>
  );
};

export default HomePage;
