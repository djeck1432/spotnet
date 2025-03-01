import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorComponent, Link, RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./index.css";
const queryClient = new QueryClient();
const router = createRouter({
    routeTree,
    defaultPendingComponent: () => _jsx("div", {}),
    defaultErrorComponent: ({ error }) => _jsx(ErrorComponent, { error: error }),
    defaultNotFoundComponent: () => {
        return (_jsxs("div", { children: [_jsx("p", { children: "Page not found" }), _jsx(Link, { to: "/", children: "Go to home" })] }));
    },
    context: {
        queryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
});
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root");
if (!rootElement)
    throw new Error("Root element not found");
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(_jsx(QueryClientProvider, { client: queryClient, children: _jsx(RouterProvider, { router: router }) }));
}
