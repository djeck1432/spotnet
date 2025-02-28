import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trade")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex items-center justify-center">
			<h1 className="text-4xl text-white">Trade page</h1>
		</div>
	);
}
