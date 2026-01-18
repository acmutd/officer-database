import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/directory")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-8 h-full">
			<Outlet />
		</div>
	);
}
