import { mutationOptions } from "@tanstack/react-query";
import { getOfficerQuery } from "./officer";
import {
	addInternship,
	deleteInternship,
	updateInternship,
} from "@/functions/internship";

export const addInternshipMutation = mutationOptions({
	mutationFn: addInternship,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});

export const deleteInternshipMutation = mutationOptions({
	mutationFn: deleteInternship,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});

export const updateInternshipMutation = mutationOptions({
	mutationFn: updateInternship,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});
