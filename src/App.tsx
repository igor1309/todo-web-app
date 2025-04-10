// src/App.tsx
import React, { Suspense } from "react"; // Import Suspense AND React
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// --- Import Context/Hooks/Components ---
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Import Styles (Only ONCE) ---
import styles from "./App.module.css";

// --- Dynamically import pages ---
// These imports now return components that React can lazy-load
const HomePage = React.lazy(() => import("./pages/HomePage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
// --- ------------------------- ---

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className={styles.appContainer}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link className={styles.navLink} to="/">
                Home
              </Link>
            </li>
            {!currentUser && (
              <>
                {" "}
                {/* Use fragment */}
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
          </ul>
        </nav>

        {/* --- Wrap Routes with Suspense --- */}
        {/* Provide a fallback UI while lazy-loaded components are fetched */}
        <Suspense
          fallback={
            <div
              style={{ textAlign: "center", marginTop: "50px", color: "#aaa" }}
            >
              Loading Page...
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={<ProtectedRoute element={<HomePage />} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Suspense>
        {/* --- --------------------------- --- */}
      </div>
    </Router>
  );
}

export default App;
