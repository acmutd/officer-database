import { getCurrentOfficer, uploadOfficerResume } from "@/functions/officer";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getOfficerQuery } from "./officer";

export const getResumeQuery = queryOptions({
	queryKey: ["officer", "current"],
	queryFn: getCurrentOfficer,
});

export const uploadResumeMutation = mutationOptions({
	mutationFn: uploadOfficerResume,
	onSuccess: (_, __, ___, context) => {
		context.client.invalidateQueries(getOfficerQuery);
	},
});
