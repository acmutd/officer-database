import { ACMErrorComponent } from "@/components/ErrorComponent";
import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { ProfileView } from "@/components/Profile/ProfileView";
import { TimeLine } from "@/components/Profile/TimeLine";
import { getOfficerQuery } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	tab: z
		.enum(["personal", "professional", "academics"])
		.default("personal")
		.catch("personal"),
});

const searchTab = searchSchema.optional().default(searchSchema.parse({}));

export const Route = createFileRoute("/_authed/profile")({
	component: RouteComponent,
	validateSearch: searchTab,
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(getOfficerQuery);
	},
	errorComponent: ACMErrorComponent,
});

function RouteComponent() {
	const { data: officer, isLoading, error } = useQuery(getOfficerQuery);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (!officer || error) {
		console.error(error);
		throw error || new Error("Officer not found");
	}
	return (
		<div className="flex justify-around gap-8 px-2">
			<div className="container flex w-2/3 flex-col gap-8 pb-24">
				<ProfileView editable />
				<ProfileTabs />
			</div>
			<div className="container w-1/3 flex-col">
				<TimeLine officerId={officer.id} />
			</div>

			<div className="absolute right-0 bottom-0">
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
