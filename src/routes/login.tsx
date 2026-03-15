import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/lib/auth";
import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { ACMErrorComponent } from "@/components/ErrorComponent";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const isAuthed = context.auth.isAuthenticated;
		if (isAuthed) {
			throw redirect({ to: "/" });
		}
	},
	component: RouteComponent,
	errorComponent: ACMErrorComponent,
});

function RouteComponent() {
	const auth = useAuth();

	if (auth.isAuthenticated) {
		return <Navigate to="/" />;
	}
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070709] px-4 py-10 sm:px-6">
			<div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.09),transparent_42%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.06),transparent_36%)]" />

			<div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-black/45 p-7 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-10">
				<div className="flex flex-col items-center text-center">
					<img src="/acm.png" alt="ACM Logo" width={80} height={80} className="h-20 w-20 rounded-xl object-contain" />
					<p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/55">ACM UTD</p>
					<h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">Officer Database</h1>
					<p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">
						Sign in with your ACM email to access your profile, directory, and officer tools.
					</p>
				</div>

				<div className="mt-8 flex justify-center">
					<LoginButton />
				</div>

				<p className="mt-5 text-center text-xs text-white/55 sm:text-sm">
					Use your official ACM Google account.
				</p>
			</div>
		</div>
	);
}
