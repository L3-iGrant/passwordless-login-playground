/**
 * Application Entry Point
 * 
 * This is the main entry point for the React application.
 * It renders the App component inside React's StrictMode for better development experience.
 * 
 * The application implements a passwordless authentication flow using EUDI Wallets
 * through Keycloak and the OpenID Connect protocol.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Render the application in the DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
