// src/components/AddTodoForm.tsx
import React, { useState } from "react";
import { useTodoService } from "../context/TodoServiceContext";
import { useAuth } from "../context/AuthContext";

// --- -------------------------------------------- ---

// Component props
interface AddTodoFormProps {
  onTodoAdded: () => void; // Callback after successful add
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onTodoAdded }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const service = useTodoService(); // Gets the full service object (real or mock)
  const { currentUser } = useAuth(); // Gets user info

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) return; // Do nothing if empty
    if (!currentUser) {
      setError("You must be logged in to add tasks.");
      return; // Cannot add if no user
    }

    setIsAdding(true);
    setError(null); // Reset error on new submission

    try {
      await service.addTodo(currentUser.uid, trimmedText);
      setText(""); // Clear input on success
      onTodoAdded(); // Call the callback prop
      console.log("AddTodoForm: onTodoAdded callback executed."); // <-- ADDED LOG
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("Could not add task. Please try again.");
    } finally {
      setIsAdding(false); // Reset loading state regardless of success/failure
    }
  };

  return (
    // Using AuthForm styles as placeholder, adjust if needed or create AddTodoForm.module.css
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", marginBottom: "5px" }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo text"
          disabled={isAdding}
          // Using generic style, replace with styles.input if using module
          style={{
            flexGrow: 1,
            padding: "8px",
            backgroundColor: "#333",
            color: "#d4d4d4",
            border: "1px solid #555",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          disabled={isAdding}
          // Using generic style, replace with styles.button if using module
          style={{
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "#0e639c",
            color: "white",
            border: "1px solid #1c7cbb",
            fontSize: "1rem",
          }}
        >
          {isAdding ? "Adding..." : "Add Task"}
        </button>
      </form>
      {/* Using generic style, replace with styles.errorMessage if using module */}
      {error && (
        <p style={{ color: "#f87171", marginTop: "0", marginBottom: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AddTodoForm;
