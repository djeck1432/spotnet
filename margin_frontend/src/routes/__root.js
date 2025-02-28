import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Footer } from "../ui/layout/footer";
import { Header } from "../ui/layout/header";
export const Route = createRootRouteWithContext()({
    component: RootComponent,
});
function RootComponent() {
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col w-screen min-h-screen bg-pageBg md:justify-between", children: [_jsx(Header, {}), _jsx(Outlet, {}), _jsx(Footer, {})] }), _jsx(ReactQueryDevtools, { buttonPosition: "top-right" }), _jsx(TanStackRouterDevtools, { position: "bottom-right" })] }));
}
