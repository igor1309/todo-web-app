// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// --- Import the CSS Module ---
import styles from "./App.module.css";
// --- You can remove the import for App.css if it's no longer needed ---
// import './App.css';

function App() {
  // Get the current user status to conditionally render links
  const { currentUser } = useAuth();

  return (
    // Use BrowserRouter to enable routing
    <Router>
      {/* Apply the main container class from the CSS module */}
      <div className={styles.appContainer}>
        {/* Navigation Bar */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {/* Link to Home Page */}
            <li>
              <Link className={styles.navLink} to="/">
                Home
              </Link>
            </li>

            {/* Conditional Links: Show Login/Signup only if no user is logged in */}
            {!currentUser && (
              <>
                {" "}
                {/* Use fragment to group conditional elements */}
                <li>
                  <Link className={styles.navLink} to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className={styles.navLink} to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            {/* We could add a conditional Logout link/button here later if desired */}
          </ul>
        </nav>

        {/* Define the Application Routes */}
        <Routes>
          {/* Home Page Route (Protected) */}
          <Route
            path="/"
            element={
              // Wrap HomePage with ProtectedRoute to ensure user is logged in
              <ProtectedRoute element={<HomePage />} />
            }
          />

          {/* Login Page Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Signup Page Route */}
          <Route path="/signup" element={<SignupPage />} />

          {/* Add other routes here if needed in the future */}
          {/* Example: <Route path="/settings" element={<SettingsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

// Export the App component for use in main.tsx
export default App;
