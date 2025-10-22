import { DirectoryProfileTabs } from "@/components/Directory/DirectoryProfileTabs";
import { ReadOnlyProfileView } from "@/components/Directory/ReadOnlyProfileView";
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

	if (!user.id || !userId) {
		redirect("/login");
	}

	const queryClient = getQueryClient();
	const currentOfficerPromise = queryClient.ensureQueryData(
		getCurrentOfficerQueryOptions
	);
	const officerByIdPromise = queryClient.ensureQueryData(
		getOfficerByIdQueryOptions(userId)
	);
	const [currentOfficer, officerById] = await Promise.all([
		currentOfficerPromise,
		officerByIdPromise,
	]);

	if (!currentOfficer || !officerById) {
		redirect("/login");
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex justify-around gap-8 px-2">
				<div className="container flex w-2/3 flex-col gap-8 pb-24">
					<ReadOnlyProfileView officerId={userId} />
					<DirectoryProfileTabs officerId={userId} />
				</div>
				<div className="container w-1/3 flex-col">
					<TimeLine officerId={userId} />
				</div>
			</div>
		</HydrationBoundary>
	);
}
