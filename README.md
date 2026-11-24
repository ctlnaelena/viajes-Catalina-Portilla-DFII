# TERRASEN · Agencia de Viajes ✈️

Aplicación web en **React** para una agencia de viajes: los usuarios exploran destinos y, al elegir uno, ven los **vuelos y hoteles** disponibles (precios, fechas y cupos) para armar su plan de viaje.

---

## Tecnologías

| Área | Herramienta |
|---|---|
| UI | React 18 + Vite 5 |
| Estilos | Tailwind CSS 4 (diseño responsivo *mobile-first*) |
| Navegación | React Router 6 (`HashRouter`) |
| Backend mock | Mock Service Worker (MSW 2) |
| API REST mock | `GET api/destinos`, `GET api/destinos/:id`, `GET api/continentes` |
| API GraphQL mock | `POST graphql` con schema real (`graphql-js`) |
| Pruebas | Playwright (Chrome, Firefox, WebKit + móviles) |
| Despliegue | `gh-pages` |

## Cómo funciona el backend mock

MSW registra un *Service Worker* que intercepta las peticiones `fetch` del navegador y responde como lo haría un servidor. Por eso:

- La app hace **peticiones HTTP reales** (se ven en la pestaña *Network* de DevTools).
- Funciona igual en local y en **GitHub Pages**, sin servidor aparte.
- Si el navegador bloquea Service Workers (ej. Firefox en ventana privada), se activa un **plan B en memoria** con los mismos handlers.

### API REST — destinos

```http
GET api/destinos?q=playa&continente=América del Norte
GET api/destinos/cusco        → 404 si no existe
GET api/continentes
```

Respuesta de ejemplo:
```json
{ "total": 1, "data": [{ "id": "cancun", "nombre": "Cancún", "pais": "México",
  "actividades": ["Cenotes", "Chichén Itzá", "Isla Mujeres", "Snorkel en arrecifes"] }] }
```

### API GraphQL — vuelos y hoteles

Schema en `src/mocks/graphqlSchema.js`. Consulta que usa la vista de detalle:

```graphql
query VuelosYHoteles($destinoId: ID!, $soloDisponibles: Boolean, $maxPrecio: Int, $minEstrellas: Int, $orden: OrdenPrecio) {
  vuelos(destinoId: $destinoId, soloDisponibles: $soloDisponibles, maxPrecio: $maxPrecio, orden: $orden) {
    aerolinea fechaSalida fechaRegreso precio asientosDisponibles disponible
  }
  hoteles(destinoId: $destinoId, soloDisponibles: $soloDisponibles, minEstrellas: $minEstrellas, orden: $orden) {
    nombre estrellas precioNoche disponibleDesde disponibleHasta habitacionesDisponibles
  }
}
```


## Rutas (React Router)

| Ruta | Vista |
|---|---|
| `/#/` | Inicio: buscador y destinos destacados (REST) |
| `/#/destinos` | Listado con búsqueda y filtro por continente (REST, filtros en la URL) |
| `/#/destinos/:id` | Detalle del destino (REST) + vuelos y hoteles (GraphQL) |
| `/#/mi-viaje` | Plan de viaje: vuelo + hotel, pasajeros y total |
| `/#/acerca` | Arquitectura y playground de las APIs |
| `*` | Página 404 |


## Estructura del proyecto

```
src/
├── api/                 # Clientes REST y GraphQL + consultas
├── mocks/               # Backend mock (MSW)
│   ├── data/            # "Base de datos": destinos, vuelos, hoteles
│   ├── graphqlSchema.js # Schema + resolvers GraphQL
│   ├── handlers.js      # Endpoints REST y GraphQL
│   └── browser.js       # Inicio del worker (+ plan B en memoria)
├── hooks/               # useAsync, useDestinos, useVuelosHoteles
├── context/             # ViajeContext: estado global del plan
├── components/
│   ├── layout/          # Layout, Navbar, Footer
│   ├── ui/              # Estados (carga/error/vacío), Etiqueta, Estrellas...
│   ├── destinos/        # DestinoCard, GrillaDestinos, BuscadorDestinos, Portada
│   └── viaje/           # VueloCard, HotelCard, FiltrosOpciones, Pestanas, ResumenViaje
├── pages/               # Una vista por ruta
├── utils/               # Formato de CLP, fechas y banderas
├── App.jsx              # Configuración de rutas
└── main.jsx             # Arranca MSW y luego React
tests/app.spec.js        # Pruebas end-to-end
```

## Manejo de estado (`useState` / `useEffect`)

- **`useAsync`**: `useState` para `data / loading / error` y `useEffect` que dispara la petición al cambiar dependencias, con `AbortController` para cancelar la anterior (evita condiciones de carrera al cambiar filtros rápido).
- **Destinos**: *debounce* de la búsqueda con `useEffect` + `setTimeout`.
- **Detalle**: los filtros (`useState`) son variables de la consulta GraphQL; al cambiar, la lista se actualiza sola.
- **ViajeContext**: el plan (vuelo, hotel, pasajeros) se guarda en `useState` y se persiste en `localStorage` con `useEffect`.
- **Navbar**: menú móvil con `useState`, se cierra al navegar (`useEffect` sobre la ruta).

## Instalación y uso

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
npm run preview    # sirve el build en http://localhost:4173
```

## Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "Agencia de viajes: React + REST/GraphQL mock"
git branch -M main
git remote add origin https://github.com/ctlnaelena/viajes-Catalina-Portilla-DFII.git
git push -u origin main
npm run deploy
```

## Pruebas en distintos navegadores

```bash
npx playwright install
npm run test:e2e
npx playwright show-report
```

### Problemas de compatibilidad detectados y corregidos

| Problema | Solución |
|---|---|
| Recargar `/destinos/cusco` en GitHub Pages daba 404 | `HashRouter` |
| Rutas de assets rotas en la subcarpeta del repo | `base: './'` en Vite y URLs relativas en los clientes API |
| Firefox privado / navegadores sin Service Worker no cargaban datos | Plan B: `fetch` envuelto con `getResponse` de MSW |
| `backdrop-filter` no soportado en algunos navegadores | `supports-[backdrop-filter]` con fondo opaco de respaldo |
| Contenedores de altura en Safari móvil (barra de direcciones) | `min-h-dvh` |
| Menú de escritorio inutilizable en pantallas chicas | Menú hamburguesa accesible (`aria-expanded`) |
