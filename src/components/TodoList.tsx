// src/components/TodoList.tsx - CORRECTED VERSION
import React from "react";
import { Todo } from "../context/TodoServiceContext";
import TodoItem from "./TodoItem"; // Make sure this import is correct

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
  // Handle Loading state FIRST
  if (loading) {
    return <p>Loading tasks...</p>; // Should return ONLY this
  }

  // Handle Error state SECOND
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Should return ONLY this
  }

  // Handle Empty state THIRD
  if (!todos || todos.length === 0) {
    // Added check for !todos just in case
    return <p>You have no tasks yet.</p>; // Should return ONLY this
  }

  // If none of the above, THEN render the list
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
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
