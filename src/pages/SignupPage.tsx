// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthForm, { AuthFormField } from '../components/AuthForm'; // Import the new component

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        // Note: We let Firebase handle password strength check (min 6 chars enforced by Firebase)
        // You could add more client-side checks if desired.

        setLoading(true);
        try {
            await signup(email, password);
            console.log("Signup successful, navigating to home...");
            navigate('/');
        } catch (err: any) {
            console.error("Signup failed:", err.code, err.message);
            // Use the utility function to set the user-facing error
            setError(mapAuthCodeToMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    // Define the fields for the AuthForm
    const formFields: AuthFormField[] = [
        {
            id: 'email',
            label: 'Email',
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            autoComplete: 'email'
        },
        {
            id: 'password',
            label: 'Password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            minLength: 6,
            autoComplete: 'new-password'
        },
        {
            id: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            required: true,
            minLength: 6,
            autoComplete: 'new-password'
        }
    ];

    return (
        <AuthForm
            title="Sign Up"
            fields={formFields}
            onSubmit={handleSubmit}
            submitButtonText="Sign Up"
            loading={loading}
            error={error}
            footerLink={{ text: 'Already have an account?', to: '/login' }}
        />
         // No extra children needed here for now
    );
};

export default SignupPage;