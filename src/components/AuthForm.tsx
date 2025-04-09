// src/components/AuthForm.tsx
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
// --- Import styles ---
import styles from "./AuthForm.module.css";
// --- --------------- ---

// Define the structure for input fields we want the form to render
export interface AuthFormField {
  id: string;
  label: string;
  type: "email" | "password" | "text"; // Add more types if needed
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
}

// Props for the AuthForm component
interface AuthFormProps {
  title: string;
  fields: AuthFormField[];
  onSubmit: (e: React.FormEvent) => Promise<void> | void; // Can be async or sync
  submitButtonText: string;
  loading: boolean;
  error: string | null;
  children?: ReactNode; // For extra elements like Google Sign-In button or links
  footerLink?: {
    // Optional link usually at the bottom
    text: string;
    to: string;
  };
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  onSubmit,
  submitButtonText,
  loading,
  error,
  children,
  footerLink,
}) => {
  return (
    // --- Apply container class ---
    <div className={styles.authFormContainer}>
      {/* --- Apply title class --- */}
      <h1 className={styles.title}>{title}</h1>

      {/* --- Apply error message class --- */}
      {/* Render div even if no error to maintain layout spacing */}
      <div className={styles.errorMessage}>{error && <p>{error}</p>}</div>

      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          // --- Apply field group class ---
          <div key={field.id} className={styles.fieldGroup}>
            <label htmlFor={field.id}>{field.label}:</label>
            <input
              type={field.type}
              id={field.id}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              minLength={field.minLength}
              autoComplete={field.autoComplete}
              // --- Apply input class ---
              className={styles.input} // Add specific input class if needed
            />
          </div>
        ))}
        {/* --- Apply button class --- */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Processing..." : submitButtonText}
        </button>
      </form>

      {/* --- Apply children container class --- */}
      {children && <div className={styles.childrenContainer}>{children}</div>}

      {/* --- Apply footer link class --- */}
      {footerLink && (
        <p className={styles.footerLink}>
          {footerLink.text}{" "}
          <Link to={footerLink.to}>
            {footerLink.to === "/login" ? "Log In" : "Sign Up"}
          </Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
