import { ACMErrorComponent } from "@/components/ErrorComponent";
import { DashboardPlaceholder } from "@/components/Profile/Dashboard";
import { Spinner } from "@/components/Spinner";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getOfficerQuery);
	},
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

function RouteComponent() {
	const { data: officer } = useSuspenseQuery(getOfficerQuery);

	if (!officer) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="px-4 md:px-6 pb-20">
			<div className="container flex w-full flex-col gap-8">
				<DashboardPlaceholder />
			</div>
		</div>
	);
}
