// src/context/TodoServiceContext.tsx (Minimal Version)
import React, { createContext, useContext, ReactNode } from "react";

// Define the TYPE of the value the context will hold.
// This will be the *full* service object provided from main.tsx.
// We need 'any' or a broad type here if we don't define a shared interface.
// Using a shared interface (`ITodoService` as before) is cleaner, but possible without.
type FullServiceType = any; // Or ideally: ITodoService defined elsewhere or here

const TodoServiceContext = createContext<FullServiceType | undefined>(
  undefined
);

// Hook returns the full service object provided by the Provider
export function useTodoService(): FullServiceType {
  const context = useContext(TodoServiceContext);
  if (context === undefined) {
    throw new Error("useTodoService must be used within a TodoServiceProvider");
  }
  return context;
}

interface TodoServiceProviderProps {
  children: ReactNode;
  service: FullServiceType; // Expects the full service object
}

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
