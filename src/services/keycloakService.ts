/**
 * Keycloak Authentication Service
 * 
 * This service handles integration with Keycloak for authentication using EUDI Wallet
 * through the OpenID Connect protocol. It provides functions for initializing Keycloak,
 * logging in/out, token management and authentication state.
 */

import Keycloak from "keycloak-js";

/**
 * Keycloak configuration object loaded from environment variables.
 * These values should be defined in the .env file.
 */
const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    idpHint: import.meta.env.VITE_KEYCLOAK_IDP_HINT
};

// Initialize Keycloak instance
export const keycloak = new Keycloak(keycloakConfig);

/**
 * Initializes the Keycloak instance.
 * Using a closure pattern to ensure Keycloak is only initialized once
 * and subsequent calls return the same promise.
 * 
 * @returns {Promise<boolean>} Promise resolving to initialization status
 */
export const initKeycloak = (() => {
    let initialized = false;
    let initPromise: Promise<boolean> | null = null;
    
    return function() {
        if (initialized) {
            return Promise.resolve(true);
        }
        
        if (initPromise) {
            return initPromise;
        }
        
        initialized = true;
        initPromise = keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256'
        });
        
        return initPromise;
    };
})();

/**
 * Redirects to Keycloak login page with OIDC IDP hint.
 * This will trigger the passwordless authentication flow with EUDI Wallet.
 */
export const doLogin = () => {
    keycloak.login({
        idpHint: keycloakConfig.idpHint
    });
};

/**
 * Logs the user out by clearing Keycloak session.
 * 
 * @returns {Promise<boolean>} Promise resolving to logout success status
 */
export const doLogout = async () => {
    try {
        // Perform back channel logout
        await keycloak.logout();
        return true;
    } catch (error) {
        console.error('Keycloak logout failed:', error);
        return false;
    }
};

/**
 * Returns the current user's authentication token.
 * 
 * @returns {string|undefined} The authentication token or undefined if not logged in
 */
export const getToken = () => {
    return keycloak.token;
};

/**
 * Checks if the user is currently logged in.
 * A user is considered logged in if they have a valid Keycloak token.
 * 
 * @returns {boolean} True if user is logged in, false otherwise
 */
export const isLoggedIn = () => {
    const isAuthenticated = !!keycloak.token;
    return isAuthenticated;
};

/**
 * Updates the token if it's about to expire.
 * 
 * @param {number} minValidity Minimum validity time in seconds
 * @returns {Promise<boolean>} Promise resolving to update success status
 */
export const updateToken = (minValidity: number) => {
    return keycloak.updateToken(minValidity);
};

/**
 * Retrieves the user's profile information from Keycloak.
 * 
 * @returns {Promise<KeycloakProfile>} Promise resolving to the user's profile
 */
export const getUserInfo = async () => {
    try {
        const userInfo = await keycloak.loadUserProfile();
        return userInfo;
    } catch (error) {
        console.error('Failed to load user info:', error);
        throw error;
    }
}