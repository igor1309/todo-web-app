// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
// Import Todo Service Context types/provider
import {
  TodoServiceProvider,
  ITodoService,
} from "./context/TodoServiceContext.tsx";
// Import the REAL service functions
import * as RealTodoService from "./services/todoService";

// --- Create the actual service instance implementing the FULL interface ---
const todoServiceImpl: ITodoService = {
  getTodosForUser: RealTodoService.getTodosForUser,
  addTodo: RealTodoService.addTodo,
  updateTodo: RealTodoService.updateTodo,
  deleteTodo: RealTodoService.deleteTodo,
};
// --- ----------------------------------------------------------------- ---

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Provide the REAL service implementation to the whole app */}
      <TodoServiceProvider service={todoServiceImpl}>
        <App />
      </TodoServiceProvider>
    </AuthProvider>
  </React.StrictMode>
);
