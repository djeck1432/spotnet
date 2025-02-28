import { QueryClient } from "@tanstack/react-query";
import "./index.css";
declare const router: import("@tanstack/react-router").Router<import("@tanstack/react-router").RootRoute<undefined, {
    queryClient: QueryClient;
}, import("@tanstack/react-router").AnyContext, import("@tanstack/react-router").AnyContext, {}, undefined, import("./routeTree.gen").RootRouteChildren, import("./routeTree.gen").FileRouteTypes>, import("@tanstack/react-router").TrailingSlashOption, boolean, import("@tanstack/history").RouterHistory, Record<string, any>, Record<string, any>>;
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
export {};
