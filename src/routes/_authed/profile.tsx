import { ACMErrorComponent } from "@/components/ErrorComponent";
import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { ProfileView } from "@/components/Profile/ProfileView";
import { Spinner } from "@/components/Spinner";
import { ProfileWelcomeModal } from "@/components/Profile/ProfileWelcomeModal";
import { useAuth } from "@/lib/auth";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { z } from "zod";
import {FeedbackButton} from "@/components/Feedback"

const searchSchema = z.object({
	tab: z
		.enum(["background", "dashboard"])
		.default("background")
		.catch("background"),
});

const searchTab = searchSchema.optional().default(searchSchema.parse({}));

export const Route = createFileRoute("/_authed/profile")({
	component: RouteComponent,
	validateSearch: searchTab,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getOfficerQuery);
	},
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

function RouteComponent() {
	const { data: officer } = useSuspenseQuery(getOfficerQuery);
	const { user } = useAuth();

	const isNewUser =
		user?.metadata.creationTime === user?.metadata.lastSignInTime;

	if (!officer) {
		return <Navigate to="/login" />;
	}

	return (
		
		<div className="flex flex-col md:flex-row justify-around gap-6 md:gap-8 px-4 md:px-6">
			<div className="container w-full md:w-1/4 flex-col">
				<ProfileView editable />
			</div>
			<div className="container flex w-full md:w-3/4 flex-col gap-8 pb-20">
				<ProfileTabs />
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
			<ProfileWelcomeModal isNewUser={isNewUser} />
			<FeedbackButton/>

		</div>
	);
}
