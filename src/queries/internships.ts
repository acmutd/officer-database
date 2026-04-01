import { mutationOptions } from "@tanstack/react-query";
import { syncOfficerCache } from "./officer";
import {
	addInternship,
	deleteInternship,
	updateInternship,
} from "@/functions/internship";

export const addInternshipMutation = mutationOptions({
	mutationFn: addInternship,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});

export const deleteInternshipMutation = mutationOptions({
	mutationFn: deleteInternship,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});

export const updateInternshipMutation = mutationOptions({
	mutationFn: updateInternship,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});
