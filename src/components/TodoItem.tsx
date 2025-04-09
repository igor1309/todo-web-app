// src/components/TodoItem.tsx
import React from "react";
import { Todo } from "../context/TodoServiceContext";
// --- Import styles ---
import styles from "./TodoItem.module.css";
// --- --------------- ---

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
    onToggleComplete(todo.id, todo.isCompleted);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  // Combine base text class with conditional completed class
  const textClasses = `${styles.text} ${
    todo.isCompleted ? styles.textCompleted : ""
  }`;

  return (
    // --- Apply item container class ---
    <li className={styles.todoItem}>
      {/* --- Apply content wrapper class --- */}
      <span className={styles.content}>
        {/* --- Apply checkbox class --- */}
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleToggle}
          aria-label={`Mark ${todo.text} as ${
            todo.isCompleted ? "incomplete" : "complete"
          }`}
          className={styles.checkbox} // Apply checkbox style
        />
        {/* --- Apply text classes --- */}
        <span className={textClasses}>{todo.text}</span>
      </span>
      {/* --- Apply delete button class --- */}
      <button
        onClick={handleDelete}
        aria-label={`Delete task ${todo.text}`}
        className={styles.deleteButton}
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;
