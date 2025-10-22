import { addUserRole, updateUserRole } from "@/functions/roles";
import { mutationOptions } from "@tanstack/react-query";
import { getOfficerByIdQueryOptions } from ".";

export const updateOfficerRolesMutationOptions = (officerId: string) =>
	mutationOptions({
		mutationFn: updateUserRole,
		onSuccess: (_, _0, _1, ctx) => {
			ctx.client.invalidateQueries(getOfficerByIdQueryOptions(officerId));
		},
	});

export const addOfficerRoleMutationOptions = (officerId: string) =>
	mutationOptions({
		mutationFn: addUserRole,
		onSuccess: (_, _0, _1, ctx) => {
			ctx.client.invalidateQueries(getOfficerByIdQueryOptions(officerId));
		},
	});
