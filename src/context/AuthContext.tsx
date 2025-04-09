import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    User, // Firebase User type
    onAuthStateChanged, // Listener for auth state changes
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase'; // Import your initialized auth instance

// Define the shape of the context data
interface AuthContextType {
    currentUser: User | null;
    loading: boolean; // To handle initial auth state loading
    signup: (email: string, pass: string) => Promise<any>; // Returns Promise<UserCredential> on success
    login: (email: string, pass: string) => Promise<any>;  // Returns Promise<UserCredential> on success
    logout: () => Promise<void>;
    signInWithGoogle: () => Promise<any>; // Returns Promise<UserCredential> on success
}

// Create the context with a default value (can be null or undefined initially)
// Using '!' asserts that the context will be provided, or throwing an error in useAuth handles it.
const AuthContext = createContext<AuthContextType>(null!);

// Custom hook to use the AuthContext easily in components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Props for the provider component
interface AuthProviderProps {
    children: ReactNode; // Allows nesting components inside the provider
}

// Create the Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Start loading until initial check is done

    // --- Firebase Auth Functions ---

    const signup = (email: string, pass: string) => {
        return createUserWithEmailAndPassword(auth, email, pass);
    };

    const login = (email: string, pass: string) => {
        return signInWithEmailAndPassword(auth, email, pass);
    };

    const logout = () => {
        return signOut(auth);
    };

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    // --- Effect to Listen for Auth State Changes ---
    useEffect(() => {
        // onAuthStateChanged returns an unsubscribe function
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Update state with the current user (or null)
            setLoading(false); // Initial auth check complete
            console.log("Auth State Changed:", user ? `User UID: ${user.uid}` : "No user");
        });

        // Cleanup function: Unsubscribe when the component unmounts
        return unsubscribe;
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Context Value ---
    const value: AuthContextType = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle
    };

    // Provide the context value to children components
    // Don't render children until the initial loading is complete
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};