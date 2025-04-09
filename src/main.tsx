// src/main.tsx (Conceptual - assuming minimal context file)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { TodoServiceProvider } from "./context/TodoServiceContext.tsx"; // Import Provider
import * as RealTodoService from "./services/todoService"; // Import REAL functions

// --- Create the full, concrete service implementation ---
const fullServiceImpl = {
  // This object IS the concrete dependency
  getTodosForUser: RealTodoService.getTodosForUser,
  addTodo: RealTodoService.addTodo,
  updateTodo: RealTodoService.updateTodo,
  deleteTodo: RealTodoService.deleteTodo,
};
// --- --------------------------------------------- ---

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Provide the FULL concrete implementation */}
      <TodoServiceProvider service={fullServiceImpl}>
        <App />
      </TodoServiceProvider>
    </AuthProvider>
  </React.StrictMode>
);
