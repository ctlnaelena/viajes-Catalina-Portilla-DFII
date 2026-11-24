import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import { ViajeProvider } from './context/ViajeContext.jsx'
import Inicio from './pages/Inicio.jsx'
import Destinos from './pages/Destinos.jsx'
import DestinoDetalle from './pages/DestinoDetalle.jsx'
import MiViaje from './pages/MiViaje.jsx'
import Acerca from './pages/Acerca.jsx'
import NoEncontrado from './pages/NoEncontrado.jsx'

// HashRouter: GitHub Pages no reescribe rutas hacia index.html, así que
// usamos /#/ruta para que recargar o compartir un enlace nunca dé 404.
export default function App() {
  return (
    <ViajeProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="destinos" element={<Destinos />} />
            <Route path="destinos/:id" element={<DestinoDetalle />} />
            <Route path="mi-viaje" element={<MiViaje />} />
            <Route path="acerca" element={<Acerca />} />
            <Route path="*" element={<NoEncontrado />} />
          </Route>
        </Routes>
      </HashRouter>
    </ViajeProvider>
  )
}
