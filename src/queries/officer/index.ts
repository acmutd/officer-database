import {
	getAllOfficers,
	getCurrentOfficer,
	getOfficer,
} from "@/functions/officer";
import { updateAcademicInfo } from "@/functions/academics";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const getCurrentOfficerQueryOptions = queryOptions({
	queryKey: ["officer", "current"],
	queryFn: getCurrentOfficer,
});

export const updateAcademicInfoMutationOptions = mutationOptions({
	mutationFn: updateAcademicInfo,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
	},
});

export const getAllOfficersQueryOptions = queryOptions({
	queryKey: ["officer", "all"],
	queryFn: getAllOfficers,
});

export const getOfficerByIdQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["officer", "id", id],
		queryFn: () => getOfficer(id),
	});
