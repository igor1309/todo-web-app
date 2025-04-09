// src/components/TodoList.tsx
import React from "react";
import { Todo } from "../context/TodoServiceContext";
import TodoItem from "./TodoItem";
// --- Import styles ---
import styles from "./TodoList.module.css";
// --- --------------- ---

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
  onToggleComplete,
  onDelete,
}) => {
  // Handle Loading state
  if (loading) {
    // --- Apply message style ---
    return <p className={styles.message}>Loading tasks...</p>;
  }

  // Handle Error state
  if (error) {
    // --- Apply error message style ---
    return <p className={styles.errorMessage}>{error}</p>;
  }

  // Handle Empty state
  if (!todos || todos.length === 0) {
    // --- Apply message style ---
    return <p className={styles.message}>You have no tasks yet.</p>;
  }

  // Render the list
  return (
    // --- Apply list style ---
    <ul className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
