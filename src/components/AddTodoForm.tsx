// src/components/AddTodoForm.tsx
import React, { useState } from "react";
import { useTodoService } from "../context/TodoServiceContext";
import { useAuth } from "../context/AuthContext";

interface ICanAddTodos {
  addTodo: (userId: string, text: string) => Promise<string>;
}

interface AddTodoFormProps {
  onTodoAdded: () => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onTodoAdded }) => {
  const [text, setText] = useState("");
  // --- Add error state ---
  const [error, setError] = useState<string | null>(null);
  // --- ---------------- ---
  const [isAdding, setIsAdding] = useState(false);

  const service = useTodoService();
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) return;
    if (!currentUser) {
      // --- Set error if no user ---
      setError("You must be logged in to add tasks.");
      // --- ---------------------- ---
      return;
    }

    setIsAdding(true);
    // --- Reset error on new submission ---
    setError(null);
    // --- ----------------------------- ---

    try {
      await service.addTodo(currentUser.uid, trimmedText);
      setText("");
      onTodoAdded();
    } catch (err) {
      console.error("Failed to add todo:", err);
      // --- Set error message on failure ---
      setError("Could not add task. Please try again.");
      // --- ---------------------------- ---
    } finally {
      setIsAdding(false);
    }
  };

  return (
    // Add a div wrapper to contain form and error message together
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "5px" /* Adjusted margin */,
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo text"
          disabled={isAdding}
          style={{ flexGrow: 1, padding: "8px" }}
        />
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Adding..." : "Add Task"}
        </button>
      </form>
      {/* --- Conditionally render error message --- */}
      {error && (
        <p style={{ color: "red", marginTop: "0", marginBottom: "10px" }}>
          {error}
        </p>
      )}
      {/* --- ---------------------------------- --- */}
    </div>
  );
};

export default AddTodoForm;
