import { ACMErrorComponent } from "@/components/ErrorComponent";
import { Spinner } from "@/components/Spinner";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/")({
	component: App,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getOfficerQuery);
	},
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

function App() {
	const { data: officer } = useSuspenseQuery(getOfficerQuery);

	if (!officer) {
		return <Navigate to="/login" />;
	}

	return <Navigate to ="/profile"/>;
}
