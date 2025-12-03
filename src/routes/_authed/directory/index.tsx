import Table from "@/components/Directory/Table";
import { ACMErrorComponent } from "@/components/ErrorComponent";
import { Spinner } from "@/components/Spinner";
import { getAllOfficersQuery } from "@/queries/officer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/directory/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getAllOfficersQuery);
	},
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-8">
			<Table />
		</div>
	);
}
