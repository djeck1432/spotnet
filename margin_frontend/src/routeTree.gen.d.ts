import { Route as rootRoute } from "./routes/__root";
import { Route as IndexImport } from "./routes/index";
import { Route as PoolImport } from "./routes/pool";
import { Route as TradeImport } from "./routes/trade";
declare const TradeRoute: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<undefined, {
    queryClient: import("@tanstack/query-core").QueryClient;
}, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, {}, undefined, unknown, unknown>, "/trade", "/trade", "/trade", "/trade", undefined, Record<never, string>, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, {}, undefined, unknown, unknown>;
declare const PoolRoute: any;
declare const IndexRoute: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<undefined, {
    queryClient: import("@tanstack/query-core").QueryClient;
}, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, {}, undefined, unknown, unknown>, "/", "/", "/", "/", undefined, Record<never, string>, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, {}, undefined, unknown, unknown>;
declare module "@tanstack/react-router" {
    interface FileRoutesByPath {
        "/": {
            id: "/";
            path: "/";
            fullPath: "/";
            preLoaderRoute: typeof IndexImport;
            parentRoute: typeof rootRoute;
        };
        "/pool": {
            id: "/pool";
            path: "/pool";
            fullPath: "/pool";
            preLoaderRoute: typeof PoolImport;
            parentRoute: typeof rootRoute;
        };
        "/trade": {
            id: "/trade";
            path: "/trade";
            fullPath: "/trade";
            preLoaderRoute: typeof TradeImport;
            parentRoute: typeof rootRoute;
        };
    }
}
export interface FileRoutesByFullPath {
    "/": typeof IndexRoute;
    "/pool": typeof PoolRoute;
    "/trade": typeof TradeRoute;
}
export interface FileRoutesByTo {
    "/": typeof IndexRoute;
    "/pool": typeof PoolRoute;
    "/trade": typeof TradeRoute;
}
export interface FileRoutesById {
    __root__: typeof rootRoute;
    "/": typeof IndexRoute;
    "/pool": typeof PoolRoute;
    "/trade": typeof TradeRoute;
}
export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath;
    fullPaths: "/" | "/pool" | "/trade";
    fileRoutesByTo: FileRoutesByTo;
    to: "/" | "/pool" | "/trade";
    id: "__root__" | "/" | "/pool" | "/trade";
    fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
    IndexRoute: typeof IndexRoute;
    PoolRoute: typeof PoolRoute;
    TradeRoute: typeof TradeRoute;
}
export declare const routeTree: import("@tanstack/react-router").RootRoute<undefined, {
    queryClient: import("@tanstack/query-core").QueryClient;
}, import("@tanstack/router-core").AnyContext, import("@tanstack/router-core").AnyContext, {}, undefined, RootRouteChildren, FileRouteTypes>;
export {};
