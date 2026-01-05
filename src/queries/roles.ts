import { mutationOptions } from "@tanstack/react-query";
import {
	getCurrentOfficersQuery,
	getArchivedOfficersQuery,
	getOfficerByIdQuery,
} from "./officer";
import { addOfficerRole, updateOfficerRole } from "@/functions/roles";

export const updateOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: updateOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getArchivedOfficersQuery);
		},
	});

export const addOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: addOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getArchivedOfficersQuery);
		},
	});
