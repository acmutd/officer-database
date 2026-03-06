import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/landing")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Navigate to="/dashboard" />;
}
