// src/components/TodoItem.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Timestamp } from "firebase/firestore";

// Import the component (will fail initially)
import TodoItem from "./TodoItem";
import { Todo } from "../context/TodoServiceContext"; // Assuming type export

// --- Mock Data & Functions ---
const mockTodoIncomplete: Todo = {
  id: "todo-1",
  text: "Incomplete Task",
  isCompleted: false,
  userId: "user1",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
const mockTodoComplete: Todo = {
  id: "todo-2",
  text: "Completed Task",
  isCompleted: true,
  userId: "user1",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
const mockOnToggleComplete = vi.fn();
const mockOnDelete = vi.fn();

// Helper to render with specific props
const renderTodoItem = (
  props: Partial<React.ComponentProps<typeof TodoItem>> = {}
) => {
  const defaultProps = {
    todo: mockTodoIncomplete, // Default to incomplete task
    onToggleComplete: mockOnToggleComplete,
    onDelete: mockOnDelete,
  };
  return render(<TodoItem {...defaultProps} {...props} />);
};

// --- Tests ---
describe("TodoItem Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks
  });

  // Test 1: Renders todo text (RED)
  it("should render the todo text", () => {
    renderTodoItem();
    expect(screen.getByText(mockTodoIncomplete.text)).toBeInTheDocument();
  });

  // Test 2: Renders checkbox (RED)
  it("should render a checkbox", () => {
    renderTodoItem();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  // Test 3: Checkbox reflects incomplete status (RED)
  it("should render an unchecked checkbox if todo is not completed", () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  // Test 4: Checkbox reflects complete status (RED)
  it("should render a checked checkbox if todo is completed", () => {
    renderTodoItem({ todo: mockTodoComplete });
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  // Test 5: Text has line-through style when completed (RED)
  it("should apply line-through style to text when todo is completed", () => {
    renderTodoItem({ todo: mockTodoComplete });
    const todoTextElement = screen.getByText(mockTodoComplete.text);
    // Check computed style - more robust than checking inline style attribute
    expect(todoTextElement).toHaveStyle("text-decoration: line-through");
  });

  // Test 6: Text does NOT have line-through style when incomplete (RED)
  it("should not apply line-through style to text when todo is not completed", () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const todoTextElement = screen.getByText(mockTodoIncomplete.text);
    expect(todoTextElement).not.toHaveStyle("text-decoration: line-through");
  });

  // Test 7: Calls onToggleComplete when checkbox is clicked (RED)
  it("should call onToggleComplete with the todo id and current status when checkbox is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockOnToggleComplete).toHaveBeenCalledWith(
      mockTodoIncomplete.id,
      mockTodoIncomplete.isCompleted
    );
  });

  // Test 8: Renders Delete button (RED)
  it("should render a delete button", () => {
    renderTodoItem();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  // Test 9: Calls onDelete when Delete button is clicked (RED)
  it("should call onDelete with the todo id when delete button is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodoIncomplete.id);
  });
});
