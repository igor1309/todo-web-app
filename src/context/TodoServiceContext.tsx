// src/context/TodoServiceContext.tsx
import React, { createContext, useContext, ReactNode } from "react";
import { Timestamp } from "firebase/firestore"; // Assuming Todo type might be needed later

// --- Define the FULL Interface for the entire Todo Service ---
// Even if components define their own smaller interfaces, the Provider
// needs to know the shape of the *complete* service object it receives
// from the Composition Root (main.tsx).
// Defining it here makes it reusable and clear.
export interface ITodoService {
  getTodosForUser: (userId: string) => Promise<Todo[]>; // Assuming Todo type is defined/imported
  addTodo: (userId: string, text: string) => Promise<string>;
  updateTodo: (
    todoId: string,
    updates: Partial<Omit<Todo, "id" | "userId" | "createdAt">>
  ) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  // Add other potential service methods if any
}

// Placeholder Todo type if not imported from elsewhere (like services)
// Make sure this matches the actual structure used.
export interface Todo {
  id: string;
  userId: string;
  text: string;
  isCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// --- Create the Context ---
// It will hold an object conforming to ITodoService.
const TodoServiceContext = createContext<ITodoService | undefined>(undefined);

// --- Custom Hook to Use the Context ---
// Returns the full service object provided by the nearest Provider.
export function useTodoService(): ITodoService {
  const context = useContext(TodoServiceContext);
  if (context === undefined) {
    throw new Error("useTodoService must be used within a TodoServiceProvider");
  }
  return context;
}

// --- Define Props for the Provider ---
interface TodoServiceProviderProps {
  children: ReactNode;
  // Expects the full service implementation (real or mock)
  service: ITodoService;
}

// --- Create the Provider Component ---
export const TodoServiceProvider: React.FC<TodoServiceProviderProps> = ({
  children,
  service,
}) => {
  return (
    <TodoServiceContext.Provider value={service}>
      {children}
    </TodoServiceContext.Provider>
  );
};
