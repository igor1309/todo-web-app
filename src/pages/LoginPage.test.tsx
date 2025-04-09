import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // Import from vitest
import { MemoryRouter, Route, Routes } from 'react-router-dom'; // Needed because component uses Link/navigate

// Components and Hooks to test/mock
import LoginPage from './LoginPage';
import HomePage from './HomePage'; // Need a dummy target for navigation
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
// vi.hoisted allows us to define mock implementations before the module factory
const mockLogin = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../context/AuthContext', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../context/AuthContext')>();
  return {
    ...mod, // Keep other exports if any
    useAuth: () => ({ // Return our mock implementation
        currentUser: null, // Or mock a user if needed for other tests
        loading: false,
        login: mockLogin, // Use the mock function
        signup: vi.fn(), // Mock other functions as needed
        logout: vi.fn(),
        signInWithGoogle: mockSignInWithGoogle, // Use the mock function
    }),
  };
});

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...mod,
    useNavigate: () => mockNavigate, // Return our mock function
  };
});


// Helper function to render the component within necessary Routers
const renderLoginPage = () => {
    render(
        // MemoryRouter is essential for components using Link or useNavigate
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} /> {/* Dummy route for navigation target */}
            </Routes>
        </MemoryRouter>
    );
};

describe('LoginPage Component', () => {
    // Reset mocks before each test
    beforeEach(() => {
        vi.clearAllMocks(); // Reset call counts etc.
        mockLogin.mockResolvedValue({ user: { uid: 'test-uid' } }); // Default successful login
        mockSignInWithGoogle.mockResolvedValue({ user: { uid: 'google-uid' } }); // Default success
    });

    it('renders login form elements correctly', () => {
        renderLoginPage();

        // Check for title
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

        // Check for input fields by label
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        // Check for buttons
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();

        // Check for signup link
        expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    it('calls email login function with credentials and navigates on success', async () => {
        renderLoginPage();
        const user = userEvent.setup(); // Use userEvent for interactions

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /log in/i });

        // Simulate user typing
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        // Simulate button click
        await user.click(loginButton);

        // Assert that the login function from useAuth was called correctly
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');

        // Assert that navigation was called after successful login
        // Use waitFor because navigation happens after the async login completes
        await waitFor(() => {
             expect(mockNavigate).toHaveBeenCalledTimes(1);
             expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

     it('calls google sign in function and navigates on success', async () => {
        renderLoginPage();
        const user = userEvent.setup();

        const googleButton = screen.getByRole('button', { name: /sign in with google/i });

        await user.click(googleButton);

        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);

        await waitFor(() => {
             expect(mockNavigate).toHaveBeenCalledTimes(1);
             expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('displays an error message on failed email login', async () => {
        // Make the mock login function reject (fail)
        mockLogin.mockRejectedValue({ code: 'auth/invalid-credential', message: 'Invalid credentials' });

        renderLoginPage();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
        await user.type(screen.getByLabelText(/password/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        // Wait for the error message to appear (react state updates are async)
        const errorMessage = await screen.findByText(/Invalid email or password./i);
        expect(errorMessage).toBeInTheDocument();

        // Ensure navigation did NOT happen
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // Add more tests: e.g., button disabled state while loading, Google login failure, etc.
});