import { updateUserSocials } from "@/functions/socials";
import { mutationOptions } from "@tanstack/react-query";
import { getCurrentOfficerQueryOptions } from ".";
import { toast } from "sonner";

export const updateUserSocialsMutationOptions = mutationOptions({
	mutationFn: updateUserSocials,
	onSuccess: (_, _0, _1, context) => {
		context.client.invalidateQueries(getCurrentOfficerQueryOptions);
		toast.success("Social links updated successfully");
	},
});
