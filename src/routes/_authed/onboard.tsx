import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/onboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Navigate to="/onboarding" />;
}
