# Developer Documentation

## Project Overview

This project demonstrates a passwordless authentication flow using EUDI Wallets with Keycloak as an OpenID Connect provider. It allows users to authenticate using their digital wallet credentials instead of traditional username/password.

## Project Structure

```
passwordless-login/
├── public/               # Static assets
├── src/                  # Source code
│   ├── assets/           # Application assets
│   ├── components/       # React components
│   │   └── AuthRedirect.tsx  # Component for handling auth redirects
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx     # Login page with EUDI Wallet login button
│   │   └── ProtectedPage.tsx # Protected content for authenticated users
│   ├── services/         # Service modules
│   │   └── keycloakService.ts # Keycloak authentication service
│   ├── App.tsx           # Main application component with routing
│   ├── main.tsx          # Application entry point
│   ├── index.css         # Global styles
│   └── App.css           # Application-specific styles
├── docs/                 # Documentation
├── package.json          # Project dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## Authentication Flow

The authentication flow uses OpenID Connect with Keycloak and EUDI Wallets:

1. **User Initiates Login**: User clicks the "Sign with EUDI Wallet" button on the login page
2. **Keycloak Redirect**: The application redirects to Keycloak with the OIDC identity provider hint
3. **EUDI Wallet Authentication**: Keycloak initiates the authentication flow with the EUDI Wallet
4. **Credential Verification**: The user presents their digital credentials from their wallet
5. **Authentication Completion**: Upon successful verification, Keycloak issues tokens
6. **Application Access**: The user is redirected back to the application with access tokens
7. **Protected Content**: The user can now access protected content

## Key Components

### `keycloakService.ts`

This service manages all Keycloak-related functionality:

- **Initialization**: Sets up the Keycloak instance and initializes it
- **Authentication**: Provides methods for login and logout
- **Token Management**: Handles token retrieval and status checking

### `App.tsx`

The main application component that:

- Initializes Keycloak on application load
- Monitors authentication state
- Implements route protection with `PrivateRoute`
- Defines the application's routing structure

### Page Components

- **`LoginPage.tsx`**: Displays the login button for EUDI Wallet authentication
- **`ProtectedPage.tsx`**: Demonstrates content that is only accessible after authentication

### `AuthRedirect.tsx`

Helper component that handles redirects based on authentication state after Keycloak operations.

## Environment Configuration

The application requires the following environment variables:

- `VITE_KEYCLOAK_URL`: URL of the Keycloak server
- `VITE_KEYCLOAK_REALM`: Keycloak realm name
- `VITE_KEYCLOAK_CLIENT_ID`: Client ID for the application in Keycloak

These can be defined in a `.env` file at the project root.

## Development Workflow

1. **Setup Environment Variables**: Create a `.env` file with the required Keycloak configuration
2. **Install Dependencies**: Run `npm install`
3. **Start Development Server**: Run `npm run dev`
4. **Build for Production**: Run `npm run build`

## Troubleshooting Authentication Issues

- **Keycloak Configuration**: Ensure Keycloak is properly configured with the OIDC identity provider
- **CORS Issues**: Check that Keycloak has the correct allowed origins and redirect URIs
- **Token Expiration**: The application checks for token validity every second, but you may need to handle token refresh manually for long sessions
- **Console Logs**: The application includes detailed console logs to help diagnose authentication issues

## Further Customization

To extend the application:

1. **Additional Protected Routes**: Add new routes in `App.tsx` wrapped with `PrivateRoute`
2. **User Profile Information**: Use the token information to display user details
3. **Role-Based Access Control**: Implement role checks based on the Keycloak token
4. **Custom UI for Authentication**: Modify the login and protected pages to match your application design 