import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../ui/core/button";
export const Route = createFileRoute("/")({
    component: Home,
});
export function Home() {
    return (_jsxs("div", { className: "mt-[100px] md:mt-0 pb-[112px] md:pb-0", children: [_jsx("h1", { className: "hidden text-center uppercase md:block text-header-text-size leading-header-text-lineheight font-pilotCommandSpaced text-headerText", children: "Trade, Earn, Grow" }), _jsxs("div", { className: "space-y-8 md:hidden", children: [_jsx("h1", { className: "text-center uppercase font-pilotCommandSpaced text-header-text-size leading-header-text-lineheight text-headerText", children: "Trade" }), _jsx("div", { className: "h-3.5 w-3.5 rounded-full bg-white mx-auto" }), _jsx("h1", { className: "text-center uppercase font-pilotCommandSpaced text-header-text-size leading-header-text-lineheight text-headerText", children: "Earn" }), _jsx("div", { className: "h-3.5 w-3.5 rounded-full bg-white mx-auto" }), _jsx("h1", { className: "text-center uppercase font-pilotCommandSpaced text-header-text-size leading-header-text-lineheight text-headerText", children: "Grow" })] }), _jsx("p", { className: "w-10/12 mx-auto mt-4 text-sm font-medium text-center font-bricolageGrotesque md:text-base text-baseWhite", children: "Trade smarter, earn bigger, and grow your portfolio with confidence." }), _jsx("div", { className: "flex justify-center mt-12", children: _jsx(Button, { variant: "outline", size: "lg", className: "w-[219px]", children: "Launch app" }) })] }));
}
