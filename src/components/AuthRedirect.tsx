/**
 * Authentication Redirect Component
 * 
 * This component handles authentication state redirects after Keycloak operations.
 * It checks the current authentication status and redirects to the appropriate page:
 * - Authenticated users are redirected to the dashboard
 * - Unauthenticated users are redirected to the login page
 * 
 * This component is useful for handling redirects after Keycloak authentication flows.
 */

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isLoggedIn } from '../services/keycloakService';

/**
 * Component that redirects users based on authentication state
 * 
 * @returns {JSX.Element} Loading indicator while checking auth state
 */
const AuthRedirect = () => {
  const history = useHistory();

  useEffect(() => {
    console.log('AuthRedirect component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Authentication status:', isLoggedIn());

    // Handle redirects after 500ms to ensure Keycloak state is updated
    const timer = setTimeout(() => {
      const authenticated = isLoggedIn();
      if (authenticated) {
        console.log('User authenticated, redirecting to dashboard');
        history.replace('/dashboard');
      } else {
        console.log('User not authenticated, redirecting to login');
        history.replace('/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [history]);

  return (
    <div>
      Checking authentication status...
    </div>
  );
};

export default AuthRedirect; 