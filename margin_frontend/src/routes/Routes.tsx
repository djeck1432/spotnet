import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import Home from './Home'
import About from './About'
import Layout from './layout'

// Define individual routes
const rootRoute = createRootRoute({ component: Layout })
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: About })

// Create the router
const router = createRouter({
  routeTree: rootRoute.addChildren([homeRoute, aboutRoute]),
  defaultPreload: 'intent',
  context: {}
})

export default router
