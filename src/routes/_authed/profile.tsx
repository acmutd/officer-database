import { ACMErrorComponent } from "@/components/ErrorComponent";
import { InternshipList } from "@/components/Profile/Internship/InternshipList";
import { ProfileView } from "@/components/Profile/ProfileView";
import { ResearchList } from "@/components/Profile/Research/ResearchList";
import { ResumeSection } from "@/components/Profile/ResumeSection";
import { Spinner } from "@/components/Spinner";
import { ProfileWelcomeModal } from "@/components/Profile/ProfileWelcomeModal";
import { useAuth } from "@/lib/auth";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import {FeedbackButton} from "@/components/Feedback"

export const Route = createFileRoute("/_authed/profile")({
	component: RouteComponent,
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
		<div className="flex flex-col justify-around gap-6 px-4 pb-20 md:flex-row md:gap-8 md:px-6">
			<div className="w-full md:w-1/4">
				<ProfileView editable />
			</div>
			<div className="flex w-full flex-col gap-8 md:w-3/4">
				<InternshipList editable />
				<ResearchList editable />
				<ResumeSection />
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
