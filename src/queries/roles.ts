import { mutationOptions } from "@tanstack/react-query";
import {
	getCurrentOfficersQuery,
	getPastOfficersQuery,
	syncOfficerCache,
} from "./officer";
import { addOfficerRole, updateOfficerRole, removeOfficerRole } from "@/functions/roles";

export const updateOfficerRoleMutation = (_officerId: string) =>
	mutationOptions({
		mutationFn: updateOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			syncOfficerCache(ctx.client, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getPastOfficersQuery);
		},
	});

export const addOfficerRoleMutation = (_officerId: string) =>
	mutationOptions({
		mutationFn: addOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			syncOfficerCache(ctx.client, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getPastOfficersQuery);
		},
	});

export const removeOfficerRoleMutation = (_officerId: string) =>
	mutationOptions({
		mutationFn: removeOfficerRole,
		onSuccess: (res, _, __, ctx) => {
			syncOfficerCache(ctx.client, res);
			ctx.client.invalidateQueries(getCurrentOfficersQuery);
			ctx.client.invalidateQueries(getPastOfficersQuery);
		},
	});
