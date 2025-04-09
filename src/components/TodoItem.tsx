// src/components/TodoItem.tsx
import React, { useState, useEffect } from "react";
import { Todo } from "../context/TodoServiceContext";
import styles from "./TodoItem.module.css";

// --- Props Interface (remains the same) ---
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, newText: string) => Promise<void>;
}

// --- Main Component ---
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onUpdateText,
}) => {
  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // --- Effect ---
  useEffect(() => {
    if (!isEditing) {
      setEditText(todo.text);
    }
  }, [todo.text, isEditing]);

  // --- Handlers ---
  const handleToggle = () => {
    if (!isEditing) {
      onToggleComplete(todo.id, todo.isCompleted);
    }
  };
  const handleDelete = () => {
    onDelete(todo.id);
  }; // Allow delete during edit now
  const handleEdit = () => {
    setEditText(todo.text);
    setIsEditing(true);
    setEditError(null);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditError(null);
  };
  const handleSave = async () => {
    const trimmedText = editText.trim();
    if (!trimmedText) {
      setEditError("Task text cannot be empty.");
      return;
    }
    if (trimmedText === todo.text) {
      setIsEditing(false);
      setEditError(null);
      return;
    }
    setIsSaving(true);
    setEditError(null);
    try {
      await onUpdateText(todo.id, trimmedText);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update text:", error);
      setEditError("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <li className={styles.todoItem ?? ""}>
      {/* --- Conditionally render sub-components --- */}
      {isEditing ? (
        <EditView
          editText={editText}
          setEditText={setEditText}
          handleSave={handleSave}
          handleCancel={handleCancel}
          isSaving={isSaving}
          editError={editError}
          todo={todo} // Pass todo for checkbox state
          handleToggle={handleToggle} // Pass toggle for checkbox change (though disabled)
        />
      ) : (
        <DisplayView
          todo={todo}
          handleToggle={handleToggle}
          handleEdit={handleEdit}
        />
      )}
      {/* Delete button outside conditional, disabled during edit/save */}
      <button
        onClick={handleDelete}
        aria-label={`Delete task ${todo.text}`}
        className={styles.deleteButton ?? ""}
        disabled={isEditing || isSaving} // Disable if editing OR saving
        style={{ marginLeft: "10px", flexShrink: 0 }} // Ensure spacing and prevent shrinking
      >
        Delete
      </button>
    </li>
  );
};

// --- Sub-Component for Display View ---
interface DisplayViewProps {
  todo: Todo;
  handleToggle: () => void;
  handleEdit: () => void;
}
const DisplayView: React.FC<DisplayViewProps> = ({
  todo,
  handleToggle,
  handleEdit,
}) => {
  const textClasses = `${styles.text ?? ""} ${
    todo.isCompleted ? styles.textCompleted ?? "" : ""
  }`.trim();
  return (
    <>
      {" "}
      {/* Use fragment */}
      <span className={styles.content ?? ""}>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleToggle}
          className={styles.checkbox ?? ""}
          aria-label={`Mark ${todo.text} as ${
            todo.isCompleted ? "incomplete" : "complete"
          }`}
        />
        <span
          className={textClasses}
          style={{ cursor: "pointer" }}
          onClick={handleEdit}
          title="Click to edit"
        >
          {todo.text}
        </span>
      </span>
      <button
        onClick={handleEdit}
        aria-label={`Edit task ${todo.text}`}
        className={styles.editButton ?? ""}
        style={{
          padding: "3px 8px",
          backgroundColor: "#555",
          border: "1px solid #777",
          color: "#eee",
          fontSize: "0.85em",
          cursor: "pointer",
          marginLeft: "10px",
          flexShrink: 0,
        }}
      >
        Edit
      </button>
    </>
  );
};

// --- Sub-Component for Edit View ---
interface EditViewProps {
  editText: string;
  setEditText: (value: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  isSaving: boolean;
  editError: string | null;
  todo: Todo; // Needed for checkbox state
  handleToggle: () => void; // Needed for checkbox onChange
}
const EditView: React.FC<EditViewProps> = ({
  editText,
  setEditText,
  handleSave,
  handleCancel,
  isSaving,
  editError,
  todo,
  handleToggle,
}) => {
  return (
    <>
      {" "}
      {/* Use fragment */}
      <span
        className={styles.content ?? ""}
        style={{ alignItems: "flex-start" }}
      >
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleToggle} // Still needed for React controlled component aspect
          disabled // Visually/functionally disabled
          className={styles.checkbox ?? ""}
          style={{ marginTop: "5px" }}
          aria-label={`Cannot change status while editing ${todo.text}`}
        />
        <div style={{ flexGrow: 1 }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
            disabled={isSaving}
            className={styles.editInput ?? ""}
            style={{
              width: "100%",
              padding: "5px",
              border: `1px solid ${editError ? "#f87171" : "#555"}`,
              backgroundColor: "#333",
              color: "#d4d4d4",
            }}
            aria-label="Edit task text"
          />
          {editError && (
            <p
              style={{
                color: "#f87171",
                fontSize: "0.8em",
                margin: "4px 0 0 0",
              }}
            >
              {editError}
            </p>
          )}
        </div>
      </span>
      <div
        style={{
          display: "flex",
          gap: "5px",
          flexShrink: 0,
          marginLeft: "10px",
        }}
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={styles.saveButton ?? ""}
          style={{
            padding: "3px 8px",
            backgroundColor: "#0b4b75",
            border: "1px solid #1e6ca3",
            color: "white",
            cursor: "pointer",
          }}
          aria-label="Save changes"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className={styles.cancelButton ?? ""}
          style={{
            padding: "3px 8px",
            backgroundColor: "#555",
            border: "1px solid #777",
            color: "#eee",
            cursor: "pointer",
          }}
          aria-label="Cancel editing"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default TodoItem;
