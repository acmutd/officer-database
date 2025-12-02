import {
	getCurrentOfficer,
	uploadOfficerResume,
	getOfficerResumeUrl,
} from "@/functions/officer";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const getResumeQuery = queryOptions({
	queryKey: ["officer", "current"],
	queryFn: getCurrentOfficer,
});

export const getResumeUrlQuery = (officerId: string) =>
	queryOptions({
		queryKey: ["officer", "resume", officerId],
		queryFn: () => getOfficerResumeUrl(officerId),
		enabled: false,
	});

export const uploadResumeMutation = mutationOptions({
	mutationFn: uploadOfficerResume,
});
