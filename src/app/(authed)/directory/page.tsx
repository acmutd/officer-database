import { Table } from "@/components/Directory/Table";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { getQueryClient } from "@/lib/queryClient";
import { validateDirectoryTabs } from "@/lib/tabs";
import { getAllOfficersQueryOptions } from "@/queries/officer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

type Props = {
	searchParams: Promise<{
		tab: string;
	}>;
};

export default async function Page({ searchParams }: Props) {
	await validateDirectoryTabs({ searchParams });
	const { user } = await getAuthenticatedAppForUser();

	if (!user || !user.officer) {
		redirect("/login");
	}
	const queryClient = getQueryClient();
	queryClient.prefetchQuery(getAllOfficersQueryOptions);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex flex-col gap-8">
				<Table />
			</div>
		</HydrationBoundary>
	);
}
