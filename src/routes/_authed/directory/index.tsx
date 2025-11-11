import Table from "@/components/Directory/Table";
import { getAllOfficersQuery } from "@/queries/officer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/directory/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(getAllOfficersQuery);
	},
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-8">
			<Table />
		</div>
	);
}
