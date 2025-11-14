import { mutationOptions } from "@tanstack/react-query";
import { getOfficerQuery } from "./officer";
import { updateSocials } from "@/functions/socials";

export const updateSocialsMutation = mutationOptions({
	mutationFn: updateSocials,
	onSuccess: (res, __, ___, ctx) => {
		ctx.client.setQueryData(getOfficerQuery.queryKey, res);
	},
});
