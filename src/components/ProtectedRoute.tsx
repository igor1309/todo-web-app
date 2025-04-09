// src/components/ProtectedRoute.tsx
import React from "react";
import { useAuth } from "../context/AuthContext"; // Ensure this path is correct
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactElement; // The component to render if authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation(); // Get current location to redirect back later

  if (loading) {
    // Optional: Render a loading indicator while Firebase checks auth state.
    // This prevents flicker if the user is already logged in.
    return <div>Loading authentication status...</div>;
    // Returning null might also be okay if AuthProvider already handles this well.
  }

  if (!currentUser) {
    // User not logged in, redirect to the login page.
    // We pass the current location in state. This allows the LoginPage
    // to potentially redirect the user back to the page they originally
    // tried to access after successful login (though we haven't implemented that part yet).
    console.log(
      "ProtectedRoute: No user found, redirecting to login from:",
      location.pathname
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the actual component that was passed in.
  return element;
};

export default ProtectedRoute; // Ensure the default export is present
