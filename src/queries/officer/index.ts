import {
	getAllOfficers,
	getCurrentOfficer,
	getOfficer,
	updateOfficerName,
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

export const updateOfficerNameMutationOptions = mutationOptions({
	mutationFn: updateOfficerName,
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

export const updateOfficerImageMutationOptions = (officerId: string) =>
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
