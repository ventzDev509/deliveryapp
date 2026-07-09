import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Contexts/AuthContext.tsx'
import { AdminProvider } from './Contexts/AdminContext.tsx'
import { DriverProvider } from './Contexts/DriverContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <DriverProvider>
          <App />
        </DriverProvider>
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
)
