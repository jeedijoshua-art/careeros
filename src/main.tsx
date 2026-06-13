import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ResumeProvider } from './context/ResumeContext'
import App from './App'
import './styles/global.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[main.tsx] Stale service worker unregistered successfully:', registration.scope);
          // Reload the page to ensure we load the fresh assets directly
          window.location.reload();
        }
      });
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeProvider>
      <App />
    </ResumeProvider>
  </StrictMode>
)
