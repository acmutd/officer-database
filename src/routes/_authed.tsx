import { AppShell } from "@/components/AppShell";
import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authed")({
	beforeLoad: async ({ context }) => {
		const isAuthed = context.auth.isAuthenticated;
		if (!isAuthed) {
			throw redirect({ to: "/login" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const auth = useAuth();

	if (!auth.isAuthenticated) {
		return <Navigate to="/login" />;
	}
	return (
		<AppShell>
			<Outlet />
		</AppShell>
	);
}
