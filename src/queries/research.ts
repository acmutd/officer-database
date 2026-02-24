import { mutationOptions } from "@tanstack/react-query";
import {
	addResearch,
	deleteResearch,
	updateResearch,
} from "@/functions/research";
import { type Officer } from "@/schemas/officer";
import { getOfficerByIdQuery, getOfficerQuery } from "./officer";

export const addResearchMutation = mutationOptions({
	mutationFn: addResearch,
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

export const deleteResearchMutation = mutationOptions({
	mutationFn: deleteResearch,
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

export const updateResearchMutation = mutationOptions({
	mutationFn: updateResearch,
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
