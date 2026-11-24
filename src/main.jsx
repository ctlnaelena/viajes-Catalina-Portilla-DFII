import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { iniciarBackendMock } from './mocks/browser.js'

// El backend mock (REST + GraphQL) se levanta antes de renderizar,
// así la primera petición de la app ya es atendida por MSW.
iniciarBackendMock()
  .catch((err) => console.error('No se pudo iniciar el backend mock:', err))
  .finally(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
