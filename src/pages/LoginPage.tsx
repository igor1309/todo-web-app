// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthForm, { AuthFormField } from '../components/AuthForm'; // Import the new component

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            console.log("Login successful, navigating to home...");
            navigate('/');
        } catch (err: any) {
            console.error("Login failed:", err);
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential': // Catch common errors
                    setError('Invalid email or password.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                default:
                    setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithGoogle();
            console.log("Google sign-in successful, navigating to home...");
            navigate('/');
        } catch (err: any) {
            console.error("Google Sign-in failed:", err);
            if (err.code !== 'auth/popup-closed-by-user') {
                 setError('Failed to sign in with Google. Please try again.');
            }
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
            autoComplete: 'current-password'
        }
    ];

    return (
        <AuthForm
            title="Login"
            fields={formFields}
            onSubmit={handleEmailLogin}
            submitButtonText="Log In"
            loading={loading}
            error={error}
            footerLink={{ text: "Don't have an account?", to: '/signup' }}
        >
             {/* Pass Google button as a child */}
             <button onClick={handleGoogleLogin} disabled={loading} style={{ marginTop: '10px', marginLeft: '10px' }}>
                Sign In with Google
            </button>
        </AuthForm>
    );
};

export default LoginPage;