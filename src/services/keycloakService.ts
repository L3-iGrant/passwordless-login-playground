import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
};

export const keycloak = new Keycloak(keycloakConfig);

// Create a closure to track initialization state
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

export const doLogin = () => {
    keycloak.login({
        idpHint: 'oidc'
    });
};

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

export const getToken = () => {
    return keycloak.token;
};

export const isLoggedIn = () => {
    console.log('Checking if user is logged in');
    const isAuthenticated = !!keycloak.token;
    console.log('User authentication status:', isAuthenticated);
    return isAuthenticated;
};

export const updateToken = (minValidity: number) => {
    return keycloak.updateToken(minValidity);
};