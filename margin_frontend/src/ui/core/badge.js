import { jsx as _jsx } from "react/jsx-runtime";
export function Badge({ name, color = "blue", className = "" }) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800",
        green: "bg-green-100 text-green-800",
        yellow: "bg-yellow-100 text-yellow-800",
        gray: "bg-gray-100 text-gray-800",
    };
    return (_jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color] || colorClasses.gray} ${className}`, children: name }));
}
