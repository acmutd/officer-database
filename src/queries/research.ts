import { mutationOptions } from "@tanstack/react-query";
import {
	addResearch,
	deleteResearch,
	updateResearch,
} from "@/functions/research";
import { getOfficerQuery } from "./officer";

export const addResearchMutation = mutationOptions({
	mutationFn: addResearch,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});

export const deleteResearchMutation = mutationOptions({
	mutationFn: deleteResearch,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});

export const updateResearchMutation = mutationOptions({
	mutationFn: updateResearch,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});
