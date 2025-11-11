import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/lib/auth";
import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const isAuthed = context.auth.isAuthenticated;
		if (isAuthed) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const auth = useAuth();

	if (auth.isAuthenticated) {
		return <Navigate to="/" />;
	}
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center">
			<div className="flex w-full flex-col items-center space-y-12 px-8 py-12">
				<div className="flex flex-col items-center space-y-4">
					<img src="/acm.png" alt="ACM Logo" width={112} height={77} />
					<h1 className="text-6xl font-bold text-white">officer database</h1>
				</div>

				<LoginButton />

				<p className="text-center text-3xl text-white/70">
					sign in with your ACM email.
				</p>
			</div>
		</div>
	);
}
