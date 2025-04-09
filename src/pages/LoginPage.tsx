import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for redirection and Link

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // To disable button during submission
    const { login, signInWithGoogle } = useAuth(); // Get login and google signin function from context
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setError(null); // Clear previous errors
        setLoading(true);

        try {
            await login(email, password);
            console.log("Login successful, navigating to home...");
            navigate('/'); // Redirect to home page on successful login
        } catch (err: any) {
            console.error("Login failed:", err);
            // Provide more user-friendly errors based on Firebase error codes
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                 case 'auth/invalid-credential': // More generic error for newer SDK versions
                    setError('Invalid email or password.');
                    break;
                default:
                    setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false); // Re-enable button
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithGoogle();
            console.log("Google sign-in successful, navigating to home...");
            navigate('/'); // Redirect to home page
        } catch (err: any) {
            console.error("Google Sign-in failed:", err);
            // Handle potential errors like popup closed by user
            if (err.code !== 'auth/popup-closed-by-user') {
                 setError('Failed to sign in with Google. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
            <form onSubmit={handleEmailLogin}>
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
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <button onClick={handleGoogleLogin} disabled={loading} style={{ marginTop: '10px', marginLeft: '10px' }}>
                Sign In with Google
            </button>

            <p style={{ marginTop: '20px' }}>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default LoginPage;