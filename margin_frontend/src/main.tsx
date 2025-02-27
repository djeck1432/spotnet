import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './TanRoute'
import App from './App'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
})

// Register for TypeScript safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
    <TanStackRouterDevtools router={router} />
  </StrictMode>,
)


