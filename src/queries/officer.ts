import {
	getAllOfficers,
	getCurrentOfficer,
	getOfficerById,
	updateAcademicInfo,
	updateOfficerImage,
	updateOfficerName,
} from "@/functions/officer";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const getOfficerQuery = queryOptions({
	queryKey: ["officer", "current"],
	queryFn: getCurrentOfficer,
});

export const getOfficerByIdQuery = (officerId: string) =>
	queryOptions({
		queryKey: ["officer", officerId],
		queryFn: () => getOfficerById(officerId),
	});
export const getAllOfficersQuery = queryOptions({
	queryKey: ["officers"],
	queryFn: getAllOfficers,
});

export const updateOfficerImageMutation = mutationOptions({
	mutationFn: updateOfficerImage,
	onSuccess: (_, __, ___, context) => {
		context.client.refetchQueries(getOfficerQuery);
		context.client.invalidateQueries(getAllOfficersQuery);
	},
});

export const updateOfficerNameMutation = mutationOptions({
	mutationFn: updateOfficerName,
	onSuccess: (res, _, __, context) => {
		context.client.setQueryData(getOfficerQuery.queryKey, res);
		context.client.invalidateQueries(getAllOfficersQuery);
	},
});

export const updateAcademicInfoMutationOptions = mutationOptions({
	mutationFn: updateAcademicInfo,
	onSuccess: (res, _, __, context) => {
		context.client.setQueryData(getOfficerQuery.queryKey, res);
		context.client.invalidateQueries(getAllOfficersQuery);
	},
});
