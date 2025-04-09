// src/components/AddTodoForm.tsx
import React, { useState } from "react";
// Import the HOOK to access the context value
import { useTodoService } from "../context/TodoServiceContext";
// Import useAuth to get user ID
import { useAuth } from "../context/AuthContext";

// --- 1. Component defines ITS OWN required interface ---
interface ICanAddTodos {
  addTodo: (userId: string, text: string) => Promise<string>;
  // Note: This component doesn't need get/update/delete, so they are NOT listed here.
}
// --- -------------------------------------------- ---

interface AddTodoFormProps {
  onTodoAdded: () => void; // Callback after successful add
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onTodoAdded }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // --- 2. Get the FULL service object via the hook ---
  // The type 'any' would come from the minimal context, or 'ITodoService' if defined.
  const service = useTodoService();
  // --- ------------------------------------------ ---

  const { currentUser } = useAuth(); // Get user ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || !currentUser) {
      return; // Do nothing if empty or no user
    }

    setError(null);
    setIsAdding(true);

    try {
      // --- 3. Use the specific method needed, implicitly satisfying ICanAddTodos ---
      // We cast the specific function we pull off the service object to match our interface if needed,
      // or just trust it matches if using 'any' or a shared interface type in context.
      await (service as ICanAddTodos).addTodo(currentUser.uid, trimmedText);
      // --- ----------------------------------------------------------------- ---
      setText(""); // Clear input on success
      onTodoAdded(); // Notify parent
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("Could not add task. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
    >
      {error && <p style={{ color: "red", margin: "0 0 10px 0" }}>{error}</p>}
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
  );
};

export default AddTodoForm;
