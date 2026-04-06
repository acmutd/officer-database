import { AdminOfficerOnboarding } from "@/components/Profile/AdminOfficerOnboarding";
import { ACMErrorComponent } from "@/components/ErrorComponent";
import { Spinner } from "@/components/Spinner";
import { isAdmin } from "@/lib/admin";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/onboarding")({
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

	if (!isAdmin(officer)) {
		return <Navigate to="/dashboard" />;
	}

	return (
		<div className="px-4 pb-20 md:px-6">
			<AdminOfficerOnboarding />
		</div>
	);
}
