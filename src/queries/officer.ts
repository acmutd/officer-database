import {
	getAllOfficers,
	getCurrentOfficer,
	getOfficerById,
	archiveOfficer,
	unarchiveOfficer,
	updateAcademicInfo,
	updateOfficerImage,
	updateOfficerName,
	updateOfficerStatus,
} from "@/functions/officer";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const getOfficerQuery = queryOptions({
	queryKey: ["officer", "current"],
	queryFn: getCurrentOfficer,
});

export const getOfficerByIdQuery = (officerId: string, archived = false) =>
	queryOptions({
		queryKey: ["officer", officerId, archived ? "archived" : "current"],
		queryFn: () => getOfficerById(officerId, archived),
	});
const officersQuery = (archived: boolean) =>
	queryOptions({
		queryKey: ["officers", archived ? "archived" : "current"],
		queryFn: () => getAllOfficers({ archived }),
	});

export const getCurrentOfficersQuery = officersQuery(false);
export const getPastOfficersQuery = officersQuery(true);

export const updateOfficerImageMutation = mutationOptions({
	mutationFn: updateOfficerImage,
	onSuccess: (_, __, ___, context) => {
		context.client.refetchQueries(getOfficerQuery);
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});

export const updateOfficerNameMutation = mutationOptions({
	mutationFn: updateOfficerName,
	onSuccess: (res, _, __, context) => {
		context.client.setQueryData(getOfficerQuery.queryKey, res);
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});

export const updateAcademicInfoMutationOptions = mutationOptions({
	mutationFn: updateAcademicInfo,
	onSuccess: (res, _, __, context) => {
		context.client.setQueryData(getOfficerQuery.queryKey, res);
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});

export const updateOfficerStatusMutation = mutationOptions({
	mutationFn: updateOfficerStatus,
	onSuccess: (res, variables, __, context) => {
		context.client.setQueryData(
			getOfficerByIdQuery(variables.officerId, false).queryKey,
			res
		);
		context.client.setQueryData(
			getOfficerByIdQuery(variables.officerId, true).queryKey,
			res
		);
		context.client.refetchQueries(getCurrentOfficersQuery);
		context.client.refetchQueries(getPastOfficersQuery);
	},
});

export const archiveOfficerMutation = mutationOptions({
	mutationFn: archiveOfficer,
	onSuccess: (res, officerId: string, __, context) => {
		const updatedOfficer = res;
		context.client.setQueryData(
			getOfficerByIdQuery(officerId, false).queryKey,
			updatedOfficer
		);
		context.client.setQueryData(
			getOfficerByIdQuery(officerId, true).queryKey,
			updatedOfficer
		);
		// Also update the current officer query if it's the same officer
		const currentOfficerKey = getOfficerQuery.queryKey;
		const currentCachedOfficer = context.client.getQueryData<any>(currentOfficerKey);
		if (currentCachedOfficer?.id === officerId) {
			context.client.setQueryData(currentOfficerKey, updatedOfficer);
		}
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});

export const unarchiveOfficerMutation = mutationOptions({
	mutationFn: unarchiveOfficer,
	onSuccess: (res, officerId, __, context) => {
		const updatedOfficer = res;
		context.client.setQueryData(
			getOfficerByIdQuery(officerId as string, false).queryKey,
			updatedOfficer
		);
		context.client.setQueryData(
			getOfficerByIdQuery(officerId as string, true).queryKey,
			updatedOfficer
		);
		// Also update the current officer query if it's the same officer
		const currentOfficerKey = getOfficerQuery.queryKey;
		const currentCachedOfficer = context.client.getQueryData<any>(currentOfficerKey);
		if (currentCachedOfficer?.id === officerId) {
			context.client.setQueryData(currentOfficerKey, updatedOfficer);
		}
		context.client.invalidateQueries(getCurrentOfficersQuery);
		context.client.invalidateQueries(getPastOfficersQuery);
	},
});
