import { DirectoryProfileTabs } from "@/components/Directory/DirectoryProfileTabs";
import { ACMErrorComponent } from "@/components/ErrorComponent";
import { ProfileView } from "@/components/Profile/ProfileView";
import { Spinner } from "@/components/Spinner";
import { getOfficerByIdQuery, getPastOfficersQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
	tab: z
		.enum(["background", "roles"])
		.default("background")
		.catch("background"),
	archived: z.boolean().optional(),
});

const searchTabSchema = searchSchema.optional().default(searchSchema.parse({}));

export const Route = createFileRoute("/_authed/directory/$userId")({
	validateSearch: searchTabSchema,
	component: RouteComponent,
	loader: async ({ context }) => {
		// Warm the past officers list to help determine archived status without 404s
		await context.queryClient.prefetchQuery(getPastOfficersQuery);
	},
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	const { archived } = Route.useSearch();
	const { data: pastOfficers } = useSuspenseQuery(getPastOfficersQuery);
	const effectiveArchived = archived ?? Boolean(pastOfficers?.some((o) => o.id === userId));
	const { data: officer } = useSuspenseQuery(getOfficerByIdQuery(userId, effectiveArchived));

	if (!officer) {
		return <Navigate to="/directory" />;
	}

	return (
		<div className="flex flex-col md:flex-row justify-around gap-6 md:gap-8 px-4 md:px-6">
			<div className="container w-full md:w-1/4 flex-col">
				<ProfileView officerId={userId} archived={effectiveArchived} />
			</div>
			<div className="container flex w-full md:w-3/4 flex-col gap-8">
				<DirectoryProfileTabs officerId={userId} archived={effectiveArchived} />
			</div>

			{/*
			<div className="absolute right-0 top-5">
				<img
					src="/peechi.png"
					alt="Peechi"
					height={100}
					width={100}
					className="animate-bounce"
				/>
			</div>
			*/}
		</div>
	);
}
