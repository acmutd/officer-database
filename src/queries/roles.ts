import { mutationOptions } from "@tanstack/react-query";
import {
	getCurrentOfficersQuery,
	getPastOfficersQuery,
	getOfficerByIdQuery,
} from "./officer";
import { addOfficerRole, updateOfficerRole, removeOfficerRole } from "@/functions/roles";

export const updateOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: updateOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getPastOfficersQuery);
		},
	});

export const addOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: addOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getPastOfficersQuery);
		},
	});

export const removeOfficerRoleMutation = (officerId: string) =>
	mutationOptions({
		mutationFn: removeOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			ctx.client.setQueryData(getOfficerByIdQuery(officerId).queryKey, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getPastOfficersQuery);
		},
	});
