import { mutationOptions } from "@tanstack/react-query";
import {
	addResearch,
	deleteResearch,
	updateResearch,
} from "@/functions/research";
import { syncOfficerCache } from "./officer";

export const addResearchMutation = mutationOptions({
	mutationFn: addResearch,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});

export const deleteResearchMutation = mutationOptions({
	mutationFn: deleteResearch,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});

export const updateResearchMutation = mutationOptions({
	mutationFn: updateResearch,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});
