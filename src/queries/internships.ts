import { mutationOptions } from "@tanstack/react-query";
import { type Officer } from "@/schemas/officer";
import { getOfficerByIdQuery, getOfficerQuery } from "./officer";
import {
	addInternship,
	deleteInternship,
	updateInternship,
} from "@/functions/internship";

export const addInternshipMutation = mutationOptions({
	mutationFn: addInternship,
	onSuccess: (res, variables, ___, ctx) => {
		ctx.client.setQueryData(getOfficerByIdQuery(res.id, false).queryKey, res);
		ctx.client.setQueryData(getOfficerByIdQuery(res.id, true).queryKey, res);
		if (!variables.officerId) {
			ctx.client.setQueryData(getOfficerQuery.queryKey, res);
		} else {
			const currentOfficer = ctx.client.getQueryData<Officer | null>(
				getOfficerQuery.queryKey
			);
			if (currentOfficer?.id === variables.officerId) {
				ctx.client.setQueryData(getOfficerQuery.queryKey, res);
			}
		}
	},
});

export const deleteInternshipMutation = mutationOptions({
	mutationFn: deleteInternship,
	onSuccess: (res, variables, ___, ctx) => {
		ctx.client.setQueryData(getOfficerByIdQuery(res.id, false).queryKey, res);
		ctx.client.setQueryData(getOfficerByIdQuery(res.id, true).queryKey, res);
		if (!variables.officerId) {
			ctx.client.setQueryData(getOfficerQuery.queryKey, res);
		} else {
			const currentOfficer = ctx.client.getQueryData<Officer | null>(
				getOfficerQuery.queryKey
			);
			if (currentOfficer?.id === variables.officerId) {
				ctx.client.setQueryData(getOfficerQuery.queryKey, res);
			}
		}
	},
});

export const updateInternshipMutation = mutationOptions({
	mutationFn: updateInternship,
	onSuccess: (res, variables, ___, ctx) => {
		ctx.client.setQueryData(getOfficerByIdQuery(res.id, false).queryKey, res);
		ctx.client.setQueryData(getOfficerByIdQuery(res.id, true).queryKey, res);
		if (!variables.officerId) {
			ctx.client.setQueryData(getOfficerQuery.queryKey, res);
		} else {
			const currentOfficer = ctx.client.getQueryData<Officer | null>(
				getOfficerQuery.queryKey
			);
			if (currentOfficer?.id === variables.officerId) {
				ctx.client.setQueryData(getOfficerQuery.queryKey, res);
			}
		}
	},
});
