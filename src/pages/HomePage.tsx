// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
// --- Import useTodoService hook ---
import { useTodoService, Todo } from "../context/TodoServiceContext"; // Import hook and Todo type
// --- Removed direct service import ---
import { useNavigate } from "react-router-dom";
// --- Import AddTodoForm ---
import AddTodoForm from "../components/AddTodoForm";
// --- -------------------- ---

const HomePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  // --- Get service from context ---
  const service = useTodoService();
  // --- ------------------------ ---
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Todos (now uses service from context) ---
  const fetchTodos = useCallback(async () => {
    console.log("Attempting fetchTodos for user:", currentUser?.uid);
    if (!currentUser) {
      console.log("fetchTodos: No current user found.");
      setLoadingTodos(false);
      return;
    }
    setLoadingTodos(true);
    setError(null);
    try {
      // --- Use service.getTodosForUser ---
      const userTodos = await service.getTodosForUser(currentUser.uid);
      // --- --------------------------- ---
      setTodos(userTodos);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError("Could not load your tasks. Please try again later.");
    } finally {
      setLoadingTodos(false);
    }
  }, [currentUser, service]); // <-- Add service to dependency array

  // --- Effect to Fetch Todos on Mount or User/Service Change ---
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // fetchTodos dependency includes currentUser and service

  // --- Logout Handler (no change needed) ---
  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Failed to log out:", error);
      setError("Failed to log out.");
    }
  };

  // --- Render Logic ---
  return (
    <div>
      <h1>ToDo List</h1>
      {currentUser && (
        <p>Welcome, {currentUser.email || `User ${currentUser.uid}`}!</p>
      )}
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Log Out
      </button>

      <hr />

      {/* --- Render AddTodoForm and pass fetchTodos as callback --- */}
      <h2>Add New Task</h2>
      <AddTodoForm onTodoAdded={fetchTodos} />
      {/* --- --------------------------------------------------- --- */}

      <hr style={{ margin: "20px 0" }} />

      <h2>Your Tasks</h2>
      {loadingTodos && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loadingTodos && !error && todos.length === 0 && (
        <p>You have no tasks yet. Add one above!</p>
      )}

      {!loadingTodos && todos.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={
                {
                  /* ... styles ... */
                }
              }
            >
              {/* We'll make this a TodoItem component soon */}
              <span
                style={{
                  textDecoration: todo.isCompleted ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
              {/* Add Update/Delete buttons later */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
