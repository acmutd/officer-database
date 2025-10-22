import { ProfileTabs } from "@/components/Profile/ProfileTabs";
import { ProfileView } from "@/components/Profile/ProfileView";
import { TimeLine } from "@/components/Profile/TimeLine";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { getQueryClient } from "@/lib/queryClient";
import { validateProfileTabs } from "@/lib/tabs";
import { getCurrentOfficerQueryOptions } from "@/queries/officer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
	searchParams: Promise<{
		tab: string;
	}>;
};

export default async function Page({ searchParams }: Props) {
	await validateProfileTabs({ searchParams });

	const { user } = await getAuthenticatedAppForUser();

	if (!user.id || !user.name) {
		redirect("/login");
	}
	const queryClient = getQueryClient();
	const officer = await queryClient.ensureQueryData(
		getCurrentOfficerQueryOptions
	);

	if (!officer) {
		redirect("/login");
	}
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex justify-around gap-8 px-2">
				<div className="container flex w-2/3 flex-col gap-8 pb-24">
					<ProfileView />
					<ProfileTabs />
				</div>
				<div className="container w-1/3 flex-col">
					<TimeLine officerId={officer.id} />
				</div>

				<div className="absolute right-0 bottom-0">
					<Image
						src="/peechi.png"
						alt="Peechi"
						height={100}
						width={100}
						className="animate-bounce"
					/>
				</div>
			</div>
		</HydrationBoundary>
	);
}
