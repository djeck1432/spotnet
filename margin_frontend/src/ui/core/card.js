import { jsx as _jsx } from "react/jsx-runtime";
export function Card({ children, className = "" }) {
    return _jsx("div", { className: `bg-pageBg shadow-md rounded-lg p-4 max-w-[500px] ${className}`, children: children });
}
