import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Button } from "../core/button";
const navlink = [
    {
        title: "Pool",
        link: "/pool",
    },
    {
        title: "Trade",
        link: "/trade",
    },
];
export function Header() {
    return (_jsxs("div", { className: "h-[88px] md:h-[120px] rounded-b-4xl lg:bg-navbg flex items-center justify-between px-4 md:px-14 lg:px-20 w-full", children: [_jsx("h4", { className: "font-bold uppercase font-instrumentsans text-baseWhite text-logo leading-logo", children: "Margin" }), _jsx("nav", { className: "items-center hidden gap-4 md:flex", children: navlink.map((link, index) => (_jsxs(React.Fragment, { children: [_jsx("a", { href: link.link, className: "text-sm font-normal text-navLinkColor font-bricolageGrotesque", children: link.title }), index === 0 && _jsx("div", { className: "w-[2px] h-[18px] bg-navSeperatorColor" })] }, link.title))) }), _jsx(Button, { variant: "outline", className: "w-[164px]", size: "md", children: "Connect Wallet" })] }));
}
