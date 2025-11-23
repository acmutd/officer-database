import { ACMErrorComponent } from "@/components/ErrorComponent";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/lib/auth";
import { getOfficerQuery } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/")({
	component: App,
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(getOfficerQuery);
	},
	errorComponent: ACMErrorComponent,
});

function App() {
	const { data: officer, isLoading } = useQuery(getOfficerQuery);
	const { user } = useAuth();

	if (isLoading) {
		return <Spinner />;
	}

	if (!officer) {
		return <Navigate to="/login" />;
	}

	const isNewUser =
		user?.metadata.creationTime === user?.metadata.lastSignInTime;
	const shouldRedirect = localStorage.getItem("visitedProfile") !== "true";

	if (isNewUser && shouldRedirect) {
		return <Navigate to="/profile" />;
	}

	return (
		<div className="mx-auto flex w-full justify-between px-16 pt-20">
			<div className="flex w-1/2 items-center gap-8">
				<div>
					<h1 className="mb-2 text-6xl font-bold text-white lowercase">
						welcome back, <br /> {officer.firstName} {officer.lastName}
					</h1>
					<img
						src="/peechi.png"
						alt="Peechi"
						className="w-4/5"
						width={200}
						height={200}
					/>
				</div>
			</div>
			<div className="flex w-1/2 flex-col rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 px-8 shadow-xl backdrop-blur-xl">
				<div className="mb-4 w-1/3 self-center rounded-b-xl bg-white/5 p-4 pt-0">
					<h2 className="my-2 text-center text-2xl font-bold text-white">
						reminders
					</h2>
				</div>
			</div>
		</div>
	);
}
