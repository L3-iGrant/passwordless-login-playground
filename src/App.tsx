/**
 * Main Application Component
 * 
 * This component handles the application's routing and authentication state.
 * It initializes Keycloak and provides route protection based on authentication status.
 */

import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { RouteProps } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import ProtectedPage from './pages/ProtectedPage';
import { initKeycloak, isLoggedIn } from './services/keycloakService';

function App() {
  // Track if Keycloak has been initialized
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  // Track if user is authenticated
  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Initialize Keycloak on component mount
   */
  useEffect(() => {
    console.log('Initializing Keycloak...');
    initKeycloak()
      .then(() => {
        console.log('Keycloak initialized successfully');
        setKeycloakInitialized(true);
        // Check authentication immediately after initialization
        const authStatus = isLoggedIn();
        console.log('Initial authentication status:', authStatus);
        setAuthenticated(authStatus);
      })
      .catch((error: unknown) => {
        console.error('Failed to initialize Keycloak', error);
        setKeycloakInitialized(true);
      });
  }, []);

  /**
   * Periodically check authentication status after Keycloak is initialized
   */
  useEffect(() => {
    if (!keycloakInitialized) return;
    
    console.log('Current URL pathname:', window.location.pathname);
    
    // Set up a periodic check of authentication status
    const checkAuthInterval = setInterval(() => {
      const currentStatus = isLoggedIn();
      if (currentStatus !== authenticated) {
        console.log('Authentication status changed:', currentStatus);
        setAuthenticated(currentStatus);
      }
    }, 1000);
    
    return () => clearInterval(checkAuthInterval);
  }, [keycloakInitialized, authenticated]);

  if (!keycloakInitialized) {
    console.log('Keycloak still initializing, showing loading screen');
    return <div>Loading...</div>;
  }

  /**
   * PrivateRoute Component
   * 
   * A wrapper for Route that redirects to the login page if user is not authenticated.
   * 
   * @param {Object} props - Component props including children and route props
   * @returns {ReactElement} Rendered component or redirect
   */
  const PrivateRoute = ({ children, ...rest }: RouteProps & { children: ReactNode }) => {
    console.log(`PrivateRoute called for path: ${rest.path}`);
    return (
      <Route
        {...rest}
        render={({ location }) => {
          console.log(`User auth check for ${rest.path}: ${authenticated}`);
          
          if (authenticated) {
            console.log(`Rendering protected content for ${rest.path}`);
            return children;
          } else {
            console.log(`Redirecting from ${rest.path} to /login`);
            return (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            );
          }
        }}
      />
    );
  };

  console.log('Rendering App component, auth status:', authenticated);
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/login">
            {authenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
          </Route>
          <PrivateRoute path="/dashboard">
            <ProtectedPage />
          </PrivateRoute>
          <Route exact path="/">
            {authenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
          </Route>
          <Route path="*">
            <div>Page not found</div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
