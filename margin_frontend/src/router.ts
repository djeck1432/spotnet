import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import RootLayout from "./routes/_layout";
import HomePage from "./routes/index";
import AboutPage from "./routes/about";

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([homeRoute, aboutRoute]),
});
