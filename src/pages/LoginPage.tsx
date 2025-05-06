import { doLogin } from '../services/keycloakService';
import '../App.css';

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