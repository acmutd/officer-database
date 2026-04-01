import { DirectoryProfileTabs } from "@/components/Directory/DirectoryProfileTabs";
import { ACMErrorComponent } from "@/components/ErrorComponent";
import { ProfileView } from "@/components/Profile/ProfileView";
import { Spinner } from "@/components/Spinner";
import { isExecutive } from "@/lib/admin";
import { getOfficerByIdQuery, getOfficerQuery } from "@/queries/officer";
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
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	const { archived } = Route.useSearch();
	const { data: viewer } = useSuspenseQuery(getOfficerQuery);
	const { data: officer } = useSuspenseQuery(getOfficerByIdQuery(userId, archived ?? false));
	const effectiveArchived = archived ?? Boolean(officer?.isArchived);
	const canEditProfile = viewer?.id === userId || (viewer ? isExecutive(viewer) : false);

	if (!officer) {
		return <Navigate to="/directory" />;
	}

	return (
		<div className="flex flex-col justify-around gap-6 px-4 md:flex-row md:gap-8 md:px-6">
			<div className="w-full md:w-1/4">
				<ProfileView officerId={userId} archived={effectiveArchived} editable={canEditProfile} />
			</div>
			<div className="flex w-full flex-col gap-8 md:w-3/4">
				<DirectoryProfileTabs
					officerId={userId}
					archived={effectiveArchived}
					editable={canEditProfile}
				/>
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
