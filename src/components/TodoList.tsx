// src/components/TodoList.tsx
import React from "react";
import { Todo } from "../context/TodoServiceContext";
import TodoItem from "./TodoItem";
import styles from "./TodoList.module.css";

// --- Add onUpdateText to props ---
interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, newText: string) => Promise<void>; // New prop
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loading,
  error,
  onToggleComplete,
  onDelete,
  onUpdateText, // Destructure new prop
}) => {
  // Handle Loading state
  if (loading) {
    return <p className={styles.message}>Loading tasks...</p>;
  }

  // Handle Error state
  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }

  // Handle Empty state
  if (!todos || todos.length === 0) {
    return <p className={styles.message}>You have no tasks yet.</p>;
  }

  // Render the list
  return (
    <ul className={styles.todoList ?? ""}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onUpdateText={onUpdateText} // Pass down new prop
        />
      ))}
    </ul>
  );
};

export default TodoList;
