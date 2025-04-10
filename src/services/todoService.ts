// src/services/todoService.ts
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp, // Use server timestamp for consistency
  orderBy, // To order todos
} from "firebase/firestore";
import { db } from "../firebase"; // Your initialized Firestore instance
import { Todo } from "../context/TodoServiceContext"; // Import Todo type from context

// Re-export Todo type if needed elsewhere, or rely on context export
// export { Todo };

const todosCollectionRef = collection(db, "todos");

// --- Get Todos for a User ---
export const getTodosForUser = async (userId: string): Promise<Todo[]> => {
  // ... (implementation from before) ...
  if (!userId) throw new Error("User ID is required to fetch todos.");
  console.log(`Fetching todos for userId: ${userId}`);
  const q = query(
    todosCollectionRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  try {
    const querySnapshot = await getDocs(q);
    const todos = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Todo)
    );
    console.log(`Fetched ${todos.length} todos`);
    return todos;
  } catch (error) {
    console.error("Error fetching todos: ", error);
    throw new Error("Failed to fetch todos.");
  }
};

// --- Add a New Todo ---
export const addTodo = async (
  userId: string,
  text: string
): Promise<string> => {
  // ... (implementation from before) ...
  if (!userId || !text)
    throw new Error("User ID and text are required to add a todo.");
  const trimmedText = text.trim();
  if (!trimmedText) throw new Error("Cannot add an empty todo."); // Add check for trimmed text
  console.log(`Adding todo for userId: ${userId}, text: ${trimmedText}`);
  try {
    const docRef = await addDoc(todosCollectionRef, {
      userId: userId,
      text: trimmedText,
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Todo added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding todo: ", error);
    throw new Error("Failed to add todo.");
  }
};

// --- Update Todo ---
export const updateTodo = async (
  todoId: string,
  updates: Partial<Omit<Todo, "id" | "userId" | "createdAt">>
): Promise<void> => {
  // ... (implementation from before) ...
  if (!todoId) throw new Error("Todo ID is required to update.");
  console.log(`Updating todo ID: ${todoId} with updates:`, updates);
  const todoDocRef = doc(db, "todos", todoId);
  try {
    await updateDoc(todoDocRef, { ...updates, updatedAt: serverTimestamp() });
    console.log("Todo updated successfully");
  } catch (error) {
    console.error("Error updating todo: ", error);
    throw new Error("Failed to update todo.");
  }
};

// --- Delete a Todo ---
export const deleteTodo = async (todoId: string): Promise<void> => {
  // ... (implementation from before) ...
  if (!todoId) throw new Error("Todo ID is required to delete.");
  console.log(`Deleting todo ID: ${todoId}`);
  const todoDocRef = doc(db, "todos", todoId);
  try {
    await deleteDoc(todoDocRef);
    console.log("Todo deleted successfully");
  } catch (error) {
    console.error("Error deleting todo: ", error);
    throw new Error("Failed to delete todo.");
  }
};
