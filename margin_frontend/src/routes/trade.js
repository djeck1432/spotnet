import { jsx as _jsx } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/trade")({
    component: RouteComponent,
});
function RouteComponent() {
    return (_jsx("div", { className: "flex items-center justify-center", children: _jsx("h1", { className: "text-4xl text-white", children: "Trade page" }) }));
}
