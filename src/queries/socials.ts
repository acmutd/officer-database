import { mutationOptions } from "@tanstack/react-query";
import { type Officer } from "@/schemas/officer";
import { getOfficerByIdQuery, getOfficerQuery } from "./officer";
import { updateSocials } from "@/functions/socials";

export const updateSocialsMutation = mutationOptions({
	mutationFn: updateSocials,
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
