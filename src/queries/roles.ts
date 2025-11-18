import { mutationOptions } from "@tanstack/react-query";
import { getAllOfficersQuery, getOfficerByIdQuery } from "./officer";
import { addOfficerRole, updateOfficerRole } from "@/functions/roles";

export const updateOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: updateOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getAllOfficersQuery);
		},
	});

export const addOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: addOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getAllOfficersQuery);
		},
	});
