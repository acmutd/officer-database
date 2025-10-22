import { mutationOptions } from "@tanstack/react-query";
import { getCurrentOfficerQueryOptions } from ".";
import {
	addResearch,
	deleteResearch,
	updateResearch,
} from "@/functions/research";

export const addResearchMutationOptions = mutationOptions({
	mutationFn: addResearch,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
	},
});

export const updateResearchMutationOptions = mutationOptions({
	mutationFn: updateResearch,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
	},
});

export const deleteResearchMutationOptions = mutationOptions({
	mutationFn: deleteResearch,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
	},
});
