import { ACMErrorComponent } from "@/components/ErrorComponent";
import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { ProfileView } from "@/components/Profile/ProfileView";
import { Spinner } from "@/components/Spinner";
import { ProfileWelcomeModal } from "@/components/Profile/ProfileWelcomeModal";
import { useAuth } from "@/lib/auth";
import { getOfficerQuery } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	tab: z
		.enum(["professional", "academics"])
		.default("professional")
		.catch("professional"),
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
	const { data: officer, isLoading } = useQuery(getOfficerQuery);
	const { user } = useAuth();

	const isNewUser =
		user?.metadata.creationTime === user?.metadata.lastSignInTime;

	if (isLoading) {
		return <Spinner />;
	}
	if (!officer) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="flex justify-around gap-8 px-6">
			<div className="container w-1/4 flex-col">
				<ProfileView editable />
			</div>
			<div className="container flex w-3/4 flex-col gap-8">
				<ProfileTabs />
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
			<ProfileWelcomeModal isNewUser={isNewUser} />
		</div>
	);
}
