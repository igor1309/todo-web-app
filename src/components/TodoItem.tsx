// src/components/TodoItem.tsx
import React from "react";
// Import Todo type
import { Todo } from "../context/TodoServiceContext";

// Define component props based on our plan
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
}) => {
  const handleToggle = () => {
    // Call the callback prop with necessary info
    onToggleComplete(todo.id, todo.isCompleted);
  };

  const handleDelete = () => {
    // Call the callback prop with necessary info
    onDelete(todo.id);
  };

  return (
    // Render as list item, matching what TodoList expects
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #eee", // Simple separator
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Test 2, 3, 4, 7 */}
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleToggle}
          aria-label={`Mark ${todo.text} as ${
            todo.isCompleted ? "incomplete" : "complete"
          }`}
        />
        {/* Test 1, 5, 6 */}
        <span
          style={{
            textDecoration: todo.isCompleted ? "line-through" : "none",
            color: todo.isCompleted ? "#aaa" : "#000", // Dim completed text
          }}
        >
          {todo.text}
        </span>
      </span>
      {/* Test 8, 9 */}
      <button
        onClick={handleDelete}
        aria-label={`Delete task ${todo.text}`}
        style={{
          marginLeft: "10px",
          padding: "3px 8px",
          backgroundColor: "#fdd", // Light red background
          border: "1px solid #fbb",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
