// src/components/TodoList.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Timestamp } from "firebase/firestore"; // Import Timestamp for mock data

// Import the component (will fail initially)
import TodoList from "./TodoList";
// Import the Todo type (assuming it's exported from context or service)
import { Todo } from "../context/TodoServiceContext";

// --- Mock Data & Functions ---
const mockTodos: Todo[] = [
  {
    id: "1",
    text: "Test Todo 1",
    isCompleted: false,
    userId: "user1",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "2",
    text: "Test Todo 2",
    isCompleted: true,
    userId: "user1",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

const mockOnToggleComplete = vi.fn();
const mockOnDelete = vi.fn();

// Helper to render with specific props
const renderTodoList = (
  props: Partial<React.ComponentProps<typeof TodoList>> = {}
) => {
  const defaultProps = {
    todos: [],
    loading: false,
    error: null,
    onToggleComplete: mockOnToggleComplete,
    onDelete: mockOnDelete,
  };
  return render(<TodoList {...defaultProps} {...props} />);
};

// --- Tests ---
describe("TodoList Component", () => {
  // Test 1: Loading State (RED)
  it("should display a loading message when loading is true", () => {
    renderTodoList({ loading: true });
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
    // Check that list and other messages are NOT rendered
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText(/could not load/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });

  // Test 2: Error State (RED)
  it("should display an error message when error prop is provided", () => {
    const errorMessage = "Failed to fetch data!";
    renderTodoList({ error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // Check that list and other messages are NOT rendered
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });

  // Test 3: Empty State (RED)
  it('should display "no tasks yet" message when not loading, no error, and todos array is empty', () => {
    renderTodoList({ todos: [], loading: false, error: null });
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    // Check that list and other messages are NOT rendered
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/could not load/i)).not.toBeInTheDocument();
  });

  // Test 4: Renders List Wrapper (ul) when todos exist (RED)
  // We won't test for individual TodoItems yet, just the list container.
  it("should render a list (ul) when todos are provided", () => {
    renderTodoList({ todos: mockTodos, loading: false, error: null });
    expect(screen.getByRole("list")).toBeInTheDocument();
    // Check that other messages are NOT rendered
    expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/could not load/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });

  // Test 5: Renders correct number of list items (stubbed) (RED)
  // This anticipates rendering TodoItem later. We'll just check for 'li' for now.
  it("should render the correct number of list items (li) based on todos prop", () => {
    renderTodoList({ todos: mockTodos, loading: false, error: null });
    // Use querySelectorAll or similar if testing-library roles aren't specific enough yet
    const listItems = screen.getAllByRole("listitem"); // Assumes each TodoItem renders an <li>
    expect(listItems).toHaveLength(mockTodos.length);
  });
});
