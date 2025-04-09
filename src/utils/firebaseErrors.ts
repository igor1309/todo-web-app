/**
 * Maps Firebase Authentication error codes to user-friendly messages.
 * @param errorCode The error code string from a Firebase Auth error.
 * @returns A user-friendly error message string.
 */
export function mapAuthCodeToMessage(errorCode: string): string {
    switch (errorCode) {
        // Login Errors
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': // More generic error for newer SDK versions / multiple issues
            return 'Invalid email or password.';
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This user account has been disabled.';

        // Signup Errors
        case 'auth/email-already-in-use':
            return 'This email address is already registered.';
        case 'auth/weak-password':
            return 'Password is too weak (should be at least 6 characters).';

        // Google Sign-In Errors
        case 'auth/popup-closed-by-user':
            return 'Sign-in process cancelled.'; // Or return '' to show no error
        case 'auth/cancelled-popup-request':
        case 'auth/popup-blocked':
            return 'Popup blocked. Please enable popups for this site and try again.';
        case 'auth/account-exists-with-different-credential':
             return 'An account already exists with this email address using a different sign-in method.';


        // General Errors
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        case 'auth/too-many-requests':
            return 'Access temporarily disabled due to too many requests. Please try again later.';

        // Default fallback
        default:
            console.warn(`Unhandled Auth Error Code: ${errorCode}`); // Log unexpected codes
            return 'An unexpected error occurred. Please try again.';
    }
}