import { DirectoryProfileTabs } from "@/components/Directory/DirectoryProfileTabs";
import { ProfileView } from "@/components/Profile/ProfileView";
import { TimeLine } from "@/components/Profile/TimeLine";
import { getOfficerByIdQuery, getOfficerQuery } from "@/queries/officer";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
	tab: z
		.enum(["professional", "academics", "roles"])
		.default("professional")
		.catch("professional"),
});

const searchTabSchema = searchSchema.optional().default(searchSchema.parse({}));

export const Route = createFileRoute("/_authed/directory/$userId")({
	validateSearch: searchTabSchema,
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const officer = await context.queryClient.ensureQueryData(
			getOfficerByIdQuery(params.userId)
		);
		if (!officer) throw redirect({ to: "/directory" });
		context.queryClient.prefetchQuery(getOfficerQuery);
	},
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return (
		<div className="flex justify-around gap-8 px-2">
			<div className="container flex w-2/3 flex-col gap-8 pb-24">
				<ProfileView officerId={userId} />
				<DirectoryProfileTabs officerId={userId} />
			</div>
			<div className="container w-1/3 flex-col">
				<TimeLine officerId={userId} />
			</div>
		</div>
	);
}
