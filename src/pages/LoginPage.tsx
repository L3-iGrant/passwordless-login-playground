/**
 * Login Page Component
 * 
 * This component displays the login page with the EUDI Wallet login button.
 * When the button is clicked, it triggers the Keycloak login flow with the OIDC identity provider,
 * which initiates the passwordless authentication with EUDI Wallet.
 */

import { doLogin } from '../services/keycloakService';
import '../App.css';

/**
 * Renders the login page with EUDI Wallet sign-in button
 * 
 * @returns {JSX.Element} The rendered login page
 */
const LoginPage = () => {
  return (
    <div className="container">
      <div className="login-card">
        <h1>Welcome</h1>
        <button 
          className="login-button" 
          onClick={doLogin}
        >
          Sign with EUDI Wallet
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 