import { mutationOptions } from "@tanstack/react-query";
import { syncOfficerCache } from "./officer";
import { updateSocials } from "@/functions/socials";

export const updateSocialsMutation = mutationOptions({
	mutationFn: updateSocials,
	onSuccess: (res, _, __, ctx) => {
		syncOfficerCache(ctx.client, res);
	},
});
