import { createRoute, createRootRoute } from "@tanstack/react-router";
import Layout from "./routes/layout";
import Home from "./routes/home";
import About from "./routes/about";

// Root Layout Route
const rootRoute = createRootRoute({ component: Layout });

// Child Routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

// Export the route tree
export const routeTree = rootRoute.addChildren([homeRoute, aboutRoute]);
