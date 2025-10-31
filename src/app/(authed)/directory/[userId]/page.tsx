import { DirectoryProfileTabs } from "@/components/Directory/DirectoryProfileTabs";
import { ProfileView } from "@/components/Profile/ProfileView";
import { TimeLine } from "@/components/Profile/TimeLine";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { getQueryClient } from "@/lib/queryClient";
import {
	getCurrentOfficerQueryOptions,
	getOfficerByIdQueryOptions,
} from "@/queries/officer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

type Props = {
	params: Promise<{
		userId: string;
	}>;
};
export default async function Page({ params }: Props) {
	const [{ user }, { userId }] = await Promise.all([
		getAuthenticatedAppForUser(),
		params,
	]);

	if (!user || !user.officer || !userId) {
		redirect("/login");
	}

	const queryClient = getQueryClient();
	queryClient.setQueryData(
		getCurrentOfficerQueryOptions.queryKey,
		user.officer
	);

	const officerById = await queryClient.ensureQueryData(
		getOfficerByIdQueryOptions(userId)
	);

	if (!officerById) {
		redirect("/login");
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex justify-around gap-8 px-2">
				<div className="container flex w-2/3 flex-col gap-8 pb-24">
					<ProfileView officerId={userId} />
					<DirectoryProfileTabs officerId={userId} />
				</div>
				<div className="container w-1/3 flex-col">
					<TimeLine officerId={userId} />
				</div>
			</div>
		</HydrationBoundary>
	);
}
