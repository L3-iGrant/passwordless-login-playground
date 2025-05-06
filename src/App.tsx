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
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Initialize Keycloak on component mount
   */
  useEffect(() => {
    initKeycloak()
      .then(() => {
        setKeycloakInitialized(true);

        const authStatus = isLoggedIn();
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
    
    const checkAuthInterval = setInterval(() => {
      const currentStatus = isLoggedIn();
      if (currentStatus !== authenticated) {
        setAuthenticated(currentStatus);
      }
    }, 1000);
    
    return () => clearInterval(checkAuthInterval);
  }, [keycloakInitialized, authenticated]);

  if (!keycloakInitialized) {
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
    return (
      <Route
        {...rest}
        render={({ location }) => {
          if (authenticated) {
            return children;
          } else {
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
