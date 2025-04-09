// src/components/TodoList.tsx
import React from "react";
// Import Todo type - ensure this path is correct based on where you defined it
import { Todo } from "../context/TodoServiceContext";
// We will import TodoItem later

// Define component props based on our plan
interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  error,
  onToggleComplete, // Prop received but not used *yet*
  onDelete, // Prop received but not used *yet*
}) => {
  // --- Conditional Rendering based on props ---

  if (loading) {
    // Test 1 expects this text
    return <p>Loading tasks...</p>;
  }

  if (error) {
    // Test 2 expects the error message prop to be displayed
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (todos.length === 0) {
    // Test 3 expects this text
    return <p>You have no tasks yet.</p>; // Note: Test expects "no tasks yet." - adjust if needed
  }

  // --- Render the list if not loading, no error, and todos exist ---
  // Test 4 expects a 'list' role (ul)
  // Test 5 expects 'listitem' roles (li) for each todo
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {todos.map((todo) => (
        // We render a basic 'li' for now to pass Test 5.
        // This will be replaced by <TodoItem ... /> later.
        <li key={todo.id} role="listitem">
          {todo.text} {/* Basic rendering */}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
