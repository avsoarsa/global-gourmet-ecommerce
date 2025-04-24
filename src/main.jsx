import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

// Set global flags
window.ANALYTICS_API_ENABLED = false; // Set to true when backend API is available

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for offline capabilities
serviceWorkerRegistration.register()
