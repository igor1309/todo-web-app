// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For password confirmation
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth(); // Get signup function
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password should be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            await signup(email, password);
            console.log("Signup successful, navigating to home...");
            navigate('/'); // Redirect to home page on successful signup
        } catch (err: any) {
            console.error("Signup failed:", err);
            // Provide more user-friendly errors
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email address is already registered.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak.');
                    break;
                default:
                    setError('Failed to create an account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label><br/>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="password">Password:</label><br/>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                    />
                </div>
                 <div style={{ marginTop: '10px' }}>
                    <label htmlFor="confirmPassword">Confirm Password:</label><br/>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                    />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </div>
    );
};

export default SignupPage;