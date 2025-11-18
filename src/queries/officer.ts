import {
	getAllOfficers,
	getCurrentOfficer,
	getOfficerById,
	updateAcademicInfo,
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

export const updateOfficerImageMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: async (data: FormData) => {
			const res = await fetch(`/api/image/${officerId}`, {
				method: "POST",
				body: data,
			});
			if (!res.ok) {
				throw new Error("Failed to update image");
			}
			const json = await res.json();
			return json.image ?? "/peechi.png";
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
