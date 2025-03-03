import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorComponent, Link, RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	defaultPendingComponent: () => <div />,
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	defaultNotFoundComponent: () => {
		return (
			<div>
				<p>Page not found</p>
				<Link to="/">Go to home</Link>
			</div>
		);
	},
	context: {
		queryClient,
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);
}
