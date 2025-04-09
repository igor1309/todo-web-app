// src/components/AddTodoForm.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mock Dependencies ---
import { useAuth } from "../context/AuthContext";
// Import the REAL context provider and the FULL service interface type
import {
  TodoServiceProvider,
  ITodoService,
} from "../context/TodoServiceContext";

// Mock the useAuth hook
vi.mock("../context/AuthContext", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../context/AuthContext")>();
  return {
    ...mod,
    useAuth: () => ({
      currentUser: { uid: "test-user-123", email: "test@test.com" }, // Simulate logged-in user
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      signInWithGoogle: vi.fn(), // Mock unused auth functions
    }),
  };
});

// --- Test Subject ---
import AddTodoForm from "./AddTodoForm"; // Import the component being tested

// --- Test Setup ---
// Create mock functions for service methods needed in tests
const mockAddTodo = vi.fn();

// Create a full mock service object implementing ITodoService
const mockTodoService: ITodoService = {
  addTodo: mockAddTodo, // Use the specific mock function here
  getTodosForUser: vi.fn().mockResolvedValue([]),
  updateTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn().mockResolvedValue(undefined),
};

// Helper function to render the component wrapped in necessary providers
const renderAddTodoForm = (onAddedCallback = vi.fn()) => {
  return render(
    // Provide the MOCK service to the component via the real provider
    <TodoServiceProvider service={mockTodoService}>
      <AddTodoForm onTodoAdded={onAddedCallback} />
    </TodoServiceProvider>
  );
};

// --- Tests ---
describe("AddTodoForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddTodo.mockResolvedValue("new-todo-id-456"); // Default success
  });

  // Test 1: Render input and button
  it("should render an input field and an Add Task button", () => {
    renderAddTodoForm();
    expect(
      screen.getByPlaceholderText(/what needs to be done/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });

  // Test 2: Input value changes on typing
  it("should update input value when user types", async () => {
    renderAddTodoForm();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    await user.type(input, "New test todo");
    expect(input).toHaveValue("New test todo");
  });

  // Test 3: Calls addTodo on submit (Should FAIL now)
  it("should call addTodo service with correct arguments and clear input on submit", async () => {
    const handleTodoAdded = vi.fn();
    renderAddTodoForm(handleTodoAdded);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    await user.type(input, "  Submit this task!  ");
    await user.click(addButton);

    // Expect failure here: mockAddTodo shouldn't be called yet
    expect(mockAddTodo).toHaveBeenCalledTimes(1);
    expect(mockAddTodo).toHaveBeenCalledWith(
      "test-user-123",
      "Submit this task!"
    );

    await waitFor(() => {
      // Expect failure here: input shouldn't clear yet
      expect(input).toHaveValue("");
    });
    expect(handleTodoAdded).toHaveBeenCalledTimes(1); // Expect failure here
  });

  // Test 4: Does not call addTodo if input is empty (Should PASS now with minimal component)
  it("should not call addTodo service if input is empty or only whitespace", async () => {
    renderAddTodoForm();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Test 1: Empty input
    await user.click(addButton);
    expect(mockAddTodo).not.toHaveBeenCalled(); // Should pass

    // Test 2: Whitespace input
    await user.type(input, "   ");
    await user.click(addButton);
    expect(mockAddTodo).not.toHaveBeenCalled(); // Should pass
  });

  // Test 5: Shows error message on failed submission (Should FAIL now)
  it("should display an error message if addTodo service fails", async () => {
    mockAddTodo.mockRejectedValue(new Error("Firestore unavailable"));
    renderAddTodoForm();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    await user.type(input, "Task that will fail");
    await user.click(addButton);

    // Expect failure here: Error message shouldn't be rendered yet
    const errorElement = await screen.findByText(/could not add task/i);
    expect(errorElement).toBeInTheDocument();
    expect(input).toHaveValue("Task that will fail"); // Should pass if error handling isn't implemented
  });
});
