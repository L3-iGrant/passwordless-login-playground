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

  // Regularly check auth status after initialization
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

  // Function to protect routes
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
