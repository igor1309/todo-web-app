// src/components/TodoItem.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Timestamp } from "firebase/firestore";

// Import the component being tested
import TodoItem from "./TodoItem";
// Import the type definition
import { Todo } from "../context/TodoServiceContext"; // Assuming type export from context

// --- Mock Data & Functions ---
// Create mock data adhering to the Todo interface
const mockTodoIncomplete: Todo = {
  id: "todo-1",
  text: "Incomplete Task",
  isCompleted: false,
  userId: "user1",
  createdAt: Timestamp.now(), // Use Firestore Timestamp
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

// Create mock handler functions using Vitest spies
const mockOnToggleComplete = vi.fn();
const mockOnDelete = vi.fn();

// Helper function to render the component with default or overridden props
const renderTodoItem = (
  props: Partial<React.ComponentProps<typeof TodoItem>> = {}
) => {
  const defaultProps = {
    todo: mockTodoIncomplete, // Default to the incomplete task for most tests
    onToggleComplete: mockOnToggleComplete,
    onDelete: mockOnDelete,
  };
  // Spread defaultProps first, then override with any props passed in
  return render(<TodoItem {...defaultProps} {...props} />);
};

// --- Tests ---
describe("TodoItem Component", () => {
  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Renders todo text
  it("should render the todo text", () => {
    renderTodoItem();
    // Find the element containing the text of the default incomplete todo
    expect(screen.getByText(mockTodoIncomplete.text)).toBeInTheDocument();
  });

  // Test 2: Renders checkbox
  it("should render a checkbox", () => {
    renderTodoItem();
    // Find the checkbox element by its accessibility role
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  // Test 3: Checkbox reflects incomplete status
  it("should render an unchecked checkbox if todo is not completed", () => {
    renderTodoItem({ todo: mockTodoIncomplete }); // Explicitly pass incomplete todo
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  // Test 4: Checkbox reflects complete status
  it("should render a checked checkbox if todo is completed", () => {
    renderTodoItem({ todo: mockTodoComplete }); // Pass the completed todo
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  // Test 5: Check for completed class when todo is completed
  it("should have the correct completed class on the text span when todo is completed", () => {
    renderTodoItem({ todo: mockTodoComplete });
    const todoTextElement = screen.getByText(mockTodoComplete.text);
    // Assert that the element's class list contains the generated class for 'textCompleted'
    // Using a regex match is often more reliable with CSS Modules
    expect(todoTextElement).toHaveClass(/textCompleted/);
  });

  // Test 6: Check for absence of completed class when todo is incomplete
  it("should not have the completed class on the text span when todo is not completed", () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const todoTextElement = screen.getByText(mockTodoIncomplete.text);
    // Assert that the element's class list does NOT contain the generated class
    expect(todoTextElement).not.toHaveClass(/textCompleted/);
  });

  // Test 7: Calls onToggleComplete when checkbox is clicked
  it("should call onToggleComplete with the todo id and current status when checkbox is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup(); // Set up user interactions
    const checkbox = screen.getByRole("checkbox");

    // Simulate a user click on the checkbox
    await user.click(checkbox);

    // Assert that the mock callback was called once
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
    // Assert that it was called with the correct arguments
    expect(mockOnToggleComplete).toHaveBeenCalledWith(
      mockTodoIncomplete.id,
      mockTodoIncomplete.isCompleted
    );
  });

  // Test 8: Renders Delete button
  it("should render a delete button", () => {
    renderTodoItem();
    // Find the button by role and accessible name (case-insensitive)
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  // Test 9: Calls onDelete when Delete button is clicked
  it("should call onDelete with the todo id when delete button is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Simulate a user click on the delete button
    await user.click(deleteButton);

    // Assert the mock callback was called once
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    // Assert it was called with the correct todo ID
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodoIncomplete.id);
  });
});
