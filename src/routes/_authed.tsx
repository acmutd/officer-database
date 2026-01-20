import { Navbar } from "@/components/Navbar";
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
		<div className="h-screen flex flex-col">
			<div className="flex w-full justify-center">
				<Navbar />
			</div>
			<main className="flex-1 px-4 pt-32 pb-4 min-h-0">
				<Outlet />
			</main>
		</div>
	);
}
