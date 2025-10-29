import {
	addInternship,
	deleteInternship,
	updateInternship,
} from "@/functions/internships";
import { mutationOptions } from "@tanstack/react-query";
import { getCurrentOfficerQueryOptions } from ".";
import { toast } from "sonner";

export const updateInternshipMutationOptions = mutationOptions({
	mutationFn: updateInternship,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
	},
});

export const deleteInternshipMutationOptions = mutationOptions({
	mutationFn: deleteInternship,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
		toast.success("Internship deleted successfully");
	},
});

export const addInternshipMutationOptions = mutationOptions({
	mutationFn: addInternship,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
	},
});
