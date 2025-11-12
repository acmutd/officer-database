import Table from "@/components/Directory/Table";
import { ACMErrorComponent } from "@/components/ErrorComponent";
import { getAllOfficersQuery } from "@/queries/officer";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_authed/directory/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		context.queryClient.prefetchQuery(getAllOfficersQuery);
	},
	errorComponent: ACMErrorComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-8">
			<Suspense fallback={<div>Loading...</div>}>
				<Table />
			</Suspense>
		</div>
	);
}
