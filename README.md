# Passwordless Login with EUDI Wallets

This project serves as a playground for developers to understand how to integrate passwordless authentication in real-world frontend applications using EUDI Wallets with the OpenID Connect Extension.

## Overview

By enabling the OpenID Connect extension in the iGrant.io Organisation Wallet and configuring Keycloak as a relying party (RP), organisations can allow users to log in without a password using their digital wallet credentials.

## Technical Stack

- React 19
- TypeScript
- Vite
- Keycloak integration
- Docker support
- OpenID Connect

## Docker Support

This project includes Docker support for easy deployment.

### Running with Docker

To build and run the application using Docker:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t passwordless-login .
docker run -p 80:80 passwordless-login
```

### Development with Docker

For development with hot-reloading, you can create a development Docker configuration. This isn't included by default but can be added as needed.

### Stopping the Docker Container

```bash
# If using Docker Compose
docker-compose down

# Or manually stop the container
docker stop <container_id>
```

## Makefile Support

This project includes a Makefile for easier Docker operations:

```bash
# Build and run the application
make

# Only build the Docker image
make build

# Only run the container
make run

# Stop the container
make stop

# View container logs
make logs

# Clean up Docker resources
make clean

# Build and run without Docker Compose
make build-run

# Run npm commands inside the container
make npm-install
make npm-build  
make npm-lint
```

## Implementation Guide: Passwordless Login with EUDI Wallets

This section guides you through the process of integrating iGrant.io's OpenID Connect extension with Keycloak to enable passwordless login using the EUDI Wallet.

### Step 1: Enable the OpenID Connect Extension

As an organisation administrator:
1. Access the iGrant.io Extensions API documentation.
2. Use the API to enable the OIDC extension.
3. Upon enabling, the response will include the OpenID Connect metadata discovery URL (/.well-known/openid-configuration).

### Step 2: Create an OpenID Client

You will need the following from Keycloak:
- Redirect URI
- Allowed origin (based on the redirect URI's domain)

Note: The Redirect URI is found in step 3 when configuring the Identity Provider.

Use these details when calling the iGrant.io API to create a new OpenID client. This step will return:
- Client ID
- Client Secret

Save these credentials for the Keycloak configuration.

### Step 3: Configure Keycloak to Use iGrant.io as an OpenID Provider

1. Log in to your Keycloak admin console.
2. Navigate to Identity Providers > Add provider > OpenID Connect v1.0.
3. Enter the following details:
   - Alias: e.g. igrant
   - Client ID: (from step 2)
   - Client Secret: (from step 2)
   - Discovery endpoint: Paste the metadata discovery URL from step 1

If the discovery endpoint cannot be used directly, retrieve individual endpoints (authorisation, token, userinfo, and JWKS) from the metadata URL in the browser and configure them manually.

Make sure Client Authentication is set to "Client Secret sent as basic auth" (show metadata > Client Authentication).

**Important Note: Presentation Definition**
Ensure the presentation definition is properly defined before linking the client to it. Once a client is linked to a presentation definition, it cannot be modified.

### Step 4: Create a Custom Authentication Flow in Keycloak

1. Go to Authentication > Flows.
2. Create a new flow, e.g., "Login with EUDI Wallet".
3. Add execution steps required for OpenID Connect-based login.
4. Mark each step as required to enforce proper validation.
5. Save the flow.

Alternatively, add these steps to your current login flow.

### Step 5: Update the Authentication Flow and Sync Mode in Keycloak

Configure your Keycloak realm to use the new authentication flow.

### Step 6: Integrate with this React Application

This application demonstrates how to implement this login flow:
1. Uses the EUDI Wallet login button in the React frontend.
2. Redirects to the Keycloak login endpoint, which includes the iGrant.io identity provider.
3. Upon successful authentication, Keycloak issues the appropriate tokens to your application.

## Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules. See the [ESLint documentation](https://eslint.org/) for more details.
