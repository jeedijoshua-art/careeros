import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ResumeProvider } from './context/ResumeContext'
import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeProvider>
      <App />
    </ResumeProvider>
  </StrictMode>
)
