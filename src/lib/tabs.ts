import { redirect } from "next/navigation";

type SearchParams = {
	searchParams: Promise<Record<string, string>>;
};

const allowedProfileTabs = ["personal", "professional", "academics"];
const allowedDirectoryTabs = ["professional", "academics", "roles"];
export const validateProfileTabs = async ({ searchParams }: SearchParams) => {
	const { tab } = await searchParams;
	if (tab && !allowedProfileTabs.includes(tab)) {
		redirect("/profile?tab=personal");
	}
};

export const validateDirectoryTabs = async ({ searchParams }: SearchParams) => {
	const { tab } = await searchParams;
	if (tab && !allowedDirectoryTabs.includes(tab)) {
		redirect("/directory?tab=professional");
	}
};
