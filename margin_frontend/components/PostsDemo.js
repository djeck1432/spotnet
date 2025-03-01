import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { api } from "../src/api/api";
function usePosts() {
    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => await api("posts").json(),
    });
}
export default function PostsDemo() {
    const { isFetching, error, data } = usePosts();
    if (isFetching)
        return "Loading...";
    if (error)
        return `An error has occurred: ${error.message}`;
    return (_jsxs("div", { className: "bg-pageBg text-white p-10 flex flex-col gap-4", children: [_jsx("h1", { className: "text-xl", children: "Posts" }), data?.slice(0, 20).map((item) => (_jsxs("div", { className: "w-[40%]", children: [_jsx("h2", { className: "font-bold text-lg", children: item.title }), _jsx("p", { className: "text-gray-500", children: item.body })] }, item.id)))] }));
}
