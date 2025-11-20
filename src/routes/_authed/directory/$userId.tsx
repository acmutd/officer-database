import { DirectoryProfileTabs } from "@/components/Directory/DirectoryProfileTabs";
import { ACMErrorComponent } from "@/components/ErrorComponent";
import { ProfileView } from "@/components/Profile/ProfileView";
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
	errorComponent: ACMErrorComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return (
		<div className="flex justify-around gap-8 px-6">
			<div className="container w-1/5 flex-col">
				<ProfileView officerId={userId} />
			</div>
			<div className="container flex w-4/5 flex-col gap-8">
				<DirectoryProfileTabs officerId={userId} />
			</div>

			<div className="absolute right-0 top-5">
				<img
					src="/peechi.png"
					alt="Peechi"
					height={100}
					width={100}
					className="animate-bounce"
				/>
			</div>
		</div>
	);
}
