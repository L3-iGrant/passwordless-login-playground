/**
 * Protected Page Component
 * 
 * This component renders content that is only accessible to authenticated users.
 * It includes a logout button that triggers the Keycloak logout flow.
 * This page is protected by the PrivateRoute in App.tsx.
 */

import { doLogout } from '../services/keycloakService';
import '../App.css';

/**
 * Renders the protected page that requires authentication
 * 
 * @returns {JSX.Element} The rendered protected page
 */
const ProtectedPage = () => {

  return (
    <div className="container">
      <h1>Protected Page</h1>
      <div className="content">
        <p>
          This is a protected page that can only be accessed after authentication with Keycloak.
          Below is some dummy text for demonstration purposes.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget
          ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          Donec euismod, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam
          nisl nisl sit amet nisl.
        </p>
        <button 
          className="logout-button" 
          onClick={doLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProtectedPage; 