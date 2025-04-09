// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodoService, Todo } from "../context/TodoServiceContext";
import TodoList from "../components/TodoList";
import AddTodoForm from "../components/AddTodoForm";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const service = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Todos ---
  const fetchTodos = useCallback(async () => {
    // ... (fetch implementation remains the same, include logs if desired)
    console.log("HomePage: fetchTodos STARTING.");
    if (!currentUser) {
      console.log("HomePage: No current user in fetchTodos.");
      setLoadingTodos(false);
      setTodos([]);
      return;
    }
    console.log(`HomePage: Attempting fetch for user: ${currentUser.uid}`);
    setLoadingTodos(true);
    setError(null);
    try {
      console.log("HomePage: Calling service.getTodosForUser...");
      const userTodos = await service.getTodosForUser(currentUser.uid);
      console.log(
        `HomePage: Fetched ${userTodos.length} todos. Data:`,
        userTodos
      );
      setTodos(userTodos);
      console.log("HomePage: setTodos has been called.");
    } catch (err) {
      console.error("HomePage: Error during fetch:", err);
      setError("Could not load your tasks. Please try again later.");
      setTodos([]);
    } finally {
      console.log(
        "HomePage: fetchTodos finally block - setting loadingTodos false."
      );
      setLoadingTodos(false);
    }
  }, [currentUser, service]);

  // --- Effects ---
  useEffect(() => {
    console.log("HomePage: Mount/dependency effect - calling fetchTodos.");
    fetchTodos();
  }, [fetchTodos]);
  useEffect(() => {
    console.log("HomePage: 'todos' state updated:", todos);
  }, [todos]);

  // --- Toggle Complete Handler ---
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    // ... (implementation remains the same)
    console.log(`Toggling completion for todo: ${id}`);
    setError(null);
    const originalTodos = todos; // Store original state for potential revert
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
      setTodos(originalTodos); // Revert optimistic update
    }
  };

  // --- Delete Handler ---
  const handleDelete = async (id: string) => {
    // ... (implementation remains the same)
    console.log(`Deleting todo: ${id}`);
    setError(null);
    const originalTodos = todos; // Store original state for potential revert
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    try {
      await service.deleteTodo(id);
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Failed to delete task. Please try again.");
      setTodos(originalTodos); // Revert optimistic update
      // Or re-fetch: await fetchTodos();
    }
  };

  // --- *** NEW: Update Text Handler *** ---
  const handleUpdateText = async (id: string, newText: string) => {
    console.log(`Updating text for todo: ${id} to "${newText}"`);
    setError(null);
    const originalTodos = todos; // Store original state for potential revert

    // Optimistic UI Update
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );

    try {
      // Call the service to update the backend
      await service.updateTodo(id, { text: newText });
      // Optional: re-fetch if you don't trust optimistic update or need updatedAt sync
      // await fetchTodos();
    } catch (err) {
      console.error("Failed to update text:", err);
      setError("Failed to save task changes. Please try again.");
      // Revert optimistic update on failure
      setTodos(originalTodos);
    }
  };
  // --- ******************************* ---

  // --- Logout Handler ---
  const handleLogout = async () => {
    /* ... remains the same ... */
    setError(null);
    try {
      await logout();
      console.log("Logout successful");
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
        <button onClick={handleLogout} className={styles.logoutButton ?? ""}>
          {" "}
          Log Out{" "}
        </button>
      </div>

      {/* General Error Display */}
      {error && !loadingTodos && (
        <p className={`${styles.errorMessage || ""}`}>{error}</p>
      )}

      <h2>Add New Task</h2>
      <AddTodoForm onTodoAdded={fetchTodos} />

      <hr style={{ margin: "20px 0" }} />

      <h2>Your Tasks</h2>
      <TodoList
        todos={todos}
        loading={loadingTodos}
        // Pass only list-specific errors if needed, otherwise general error is fine
        error={error && !loadingTodos ? "Could not load tasks." : null} // Example: More specific list error
        onToggleComplete={handleToggleComplete}
        onDelete={handleDelete}
        onUpdateText={handleUpdateText} // <-- Pass down the new handler
      />
    </div>
  );
};

export default HomePage;
