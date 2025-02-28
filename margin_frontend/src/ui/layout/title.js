import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Title({ title, subtitle, className = "" }) {
    return (_jsxs("div", { className: ` ${className}`, children: [_jsx("h1", { className: "text-3xl font-bold text-[#313131] ", children: title }), subtitle && _jsx("p", { className: "mt-1 text-sm text-white", children: subtitle })] }));
}
