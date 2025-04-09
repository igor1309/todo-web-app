import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Define the structure for input fields we want the form to render
export interface AuthFormField {
    id: string;
    label: string;
    type: 'email' | 'password' | 'text'; // Add more types if needed
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
    footerLink?: { // Optional link usually at the bottom
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
    footerLink
}) => {
    return (
        <div>
            <h1>{title}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                {fields.map((field) => (
                    <div key={field.id} style={{ marginTop: '10px' }}>
                        <label htmlFor={field.id}>{field.label}:</label><br />
                        <input
                            type={field.type}
                            id={field.id}
                            value={field.value}
                            onChange={field.onChange}
                            required={field.required}
                            minLength={field.minLength}
                            autoComplete={field.autoComplete}
                            style={{ width: '95%', padding: '8px', marginTop: '4px' }} // Basic styling
                        />
                    </div>
                ))}
                <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                    {loading ? 'Processing...' : submitButtonText}
                </button>
            </form>

            {/* Render any additional children passed in (e.g., Google button) */}
            {children}

            {/* Render the footer link if provided */}
            {footerLink && (
                 <p style={{ marginTop: '20px' }}>
                    {footerLink.text} <Link to={footerLink.to}>{footerLink.to === '/login' ? 'Log In' : 'Sign Up'}</Link>
                </p>
            )}
        </div>
    );
};

export default AuthForm;