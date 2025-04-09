// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodoService, Todo } from "../context/TodoServiceContext";
import TodoList from "../components/TodoList";
import AddTodoForm from "../components/AddTodoForm";
import styles from "./HomePage.module.css"; // Assuming HomePage styles exist

const HomePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const service = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Todos (with detailed logs) ---
  const fetchTodos = useCallback(async () => {
    console.log("HomePage: fetchTodos STARTING."); // <-- ADDED LOG

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
      // --- Log the fetched data ---
      console.log(
        `HomePage: Fetched ${userTodos.length} todos. Data:`,
        userTodos
      ); // <-- ADDED LOG
      // --- --------------------- ---
      setTodos(userTodos); // Update state with fetched todos
      console.log("HomePage: setTodos has been called."); // <-- ADDED LOG
    } catch (err) {
      console.error("HomePage: Error during fetch:", err); // <-- MODIFIED LOG
      setError("Could not load your tasks. Please try again later.");
      setTodos([]); // Clear todos on error
    } finally {
      // CRUCIAL: Always set loading to false after attempt
      console.log(
        "HomePage: fetchTodos finally block - setting loadingTodos false."
      ); // <-- MODIFIED LOG
      setLoadingTodos(false);
    }
  }, [currentUser, service]); // Dependencies: currentUser and service

  // Initial fetch effect
  useEffect(() => {
    console.log("HomePage: Mount/dependency effect - calling fetchTodos."); // <-- ADDED LOG
    fetchTodos();
  }, [fetchTodos]); // Dependency ensures fetchTodos is stable

  // --- Add Effect to monitor 'todos' state ---
  useEffect(() => {
    console.log("HomePage: 'todos' state updated:", todos); // <-- ADDED LOG
  }, [todos]);
  // --- ------------------------------------- ---

  // --- Define Handler for Toggling Completion ---
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    console.log(`Toggling completion for todo: ${id}`);
    setError(null);
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === id ? { ...t, isCompleted: !currentStatus } : t
      )
    );
    try {
      await service.updateTodo(id, { isCompleted: !currentStatus });
    } catch (err) {
      console.error("Failed to toggle complete:", err);
      setError("Failed to update task status. Please try again.");
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
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    try {
      await service.deleteTodo(id);
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete task. Please try again.");
      await fetchTodos(); // Re-fetch to restore list on delete failure
    }
  };

  // --- Logout Handler ---
  const handleLogout = async () => {
    setError(null);
    try {
      await logout();
      console.log("Logout successful");
      // Redirect happens via ProtectedRoute checking currentUser
    } catch (error) {
      console.error("Failed to log out:", error);
      setError("Failed to log out.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {currentUser && (
          <p style={{ margin: 0 }}>
            Welcome, {currentUser.email || `User ${currentUser.uid}`}!
          </p>
        )}
        <button
          onClick={handleLogout}
          className={styles.logoutButton} // Assuming styles.logoutButton exists
        >
          Log Out
        </button>
      </div>
      {/* Display general errors */}
      {error && !loadingTodos && (
        <p className={`${styles.errorMessage || ""}`}>{error}</p>
      )}{" "}
      {/* Check if errorMessage class exists */}
      <h2>Add New Task</h2>
      <AddTodoForm onTodoAdded={fetchTodos} />
      <hr style={{ margin: "20px 0" }} />
      <h2>Your Tasks</h2>
      <TodoList
        todos={todos}
        loading={loadingTodos}
        // Only pass list-specific errors if handled separately,
        // otherwise, the general error above might suffice or cause duplicates.
        // For now, we pass the general error state.
        error={error && !loadingTodos ? error : null} // Show error only if not loading
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HomePage;
