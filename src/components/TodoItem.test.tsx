// src/components/TodoItem.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Timestamp } from "firebase/firestore";

// Import the component being tested (will fail initially for new features)
import TodoItem from "./TodoItem";
// Import the type definition
import { Todo } from "../context/TodoServiceContext";

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

// Mock handler functions using Vitest spies
const mockOnToggleComplete = vi.fn();
const mockOnDelete = vi.fn();
// Add mock for update handler
const mockOnUpdateText = vi.fn();

// Helper function to render the component with default or overridden props
const renderTodoItem = (
  props: Partial<React.ComponentProps<typeof TodoItem>> = {}
) => {
  const defaultProps: React.ComponentProps<typeof TodoItem> = {
    // Ensure correct type
    todo: mockTodoIncomplete, // Default to incomplete task
    onToggleComplete: mockOnToggleComplete,
    onDelete: mockOnDelete,
    onUpdateText: mockOnUpdateText, // Provide default for the new prop
  };
  // Spread defaultProps first, then override with any props passed in
  return render(<TodoItem {...defaultProps} {...props} />);
};

// --- Tests ---
describe("TodoItem Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any mock implementations if necessary, e.g., default success
    mockOnUpdateText.mockResolvedValue(undefined);
  });

  it("should render the todo text", () => {
    renderTodoItem();
    expect(screen.getByText(mockTodoIncomplete.text)).toBeInTheDocument();
  });

  it("should render a checkbox", () => {
    renderTodoItem();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should render an unchecked checkbox if todo is not completed", () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should render a checked checkbox if todo is completed", () => {
    renderTodoItem({ todo: mockTodoComplete });
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("should have the correct completed class on the text span when todo is completed", () => {
    renderTodoItem({ todo: mockTodoComplete });
    const todoTextElement = screen.getByText(mockTodoComplete.text);
    expect(todoTextElement).toHaveClass(/textCompleted/);
  });

  it("should not have the completed class on the text span when todo is not completed", () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const todoTextElement = screen.getByText(mockTodoIncomplete.text);
    expect(todoTextElement).not.toHaveClass(/textCompleted/);
  });

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

  it("should render a delete button", () => {
    renderTodoItem();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("should call onDelete with the todo id when delete button is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodoIncomplete.id);
  });

  it("should display an Edit button when not in edit mode", () => {
    renderTodoItem();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument(); // Input field
  });

  it("should enter edit mode when Edit button is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /edit/i }));

    // Assertions for edit mode UI appearing:
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(mockTodoIncomplete.text);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    // Assertions for display mode UI disappearing:
    expect(screen.queryByText(mockTodoIncomplete.text)).not.toBeInTheDocument();
    // Use the specific label query which works without waitFor
    expect(
      screen.queryByLabelText(`Edit task ${mockTodoIncomplete.text}`)
    ).not.toBeInTheDocument();

    // Assertions for elements remaining visible:
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("should update the input value when typing in edit mode", async () => {
    renderTodoItem();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "Updated text");

    expect(input).toHaveValue("Updated text");
  });

  it("should exit edit mode without calling onUpdateText when Cancel button is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Changed my mind");

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    // Back to display mode
    expect(screen.getByText(mockTodoIncomplete.text)).toBeInTheDocument(); // Original text
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i })
    ).not.toBeInTheDocument();

    expect(mockOnUpdateText).not.toHaveBeenCalled();
  });

  it("should call onUpdateText with id and new text and exit edit mode when Save button is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /edit/i }));
    const input = screen.getByRole("textbox");

    const newText = "Successfully updated task";
    await user.clear(input);
    await user.type(input, `  ${newText}  `); // Add whitespace

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockOnUpdateText).toHaveBeenCalledTimes(1);
    expect(mockOnUpdateText).toHaveBeenCalledWith(
      mockTodoIncomplete.id,
      newText
    ); // Expect trimmed

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /save/i })
      ).not.toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i })
    ).not.toBeInTheDocument();
  });

  it("should NOT call onUpdateText if the text is unchanged or empty/whitespace when Save is clicked", async () => {
    renderTodoItem({ todo: mockTodoIncomplete });
    const user = userEvent.setup();

    // Scenario 1: Text unchanged
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockOnUpdateText).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument(); // Exit edit mode
    expect(
      screen.queryByRole("button", { name: /save/i })
    ).not.toBeInTheDocument();

    // Scenario 2: Text is empty/whitespace
    await user.click(screen.getByRole("button", { name: /edit/i })); // Re-enter
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockOnUpdateText).not.toHaveBeenCalled(); // Still 0 calls
    // Should remain in edit mode if save is invalid (empty text)
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("   ");
  });
});
