import { createWorkspaceOfficerAccount } from "@/functions/admin";
import { mutationOptions } from "@tanstack/react-query";

export const createWorkspaceOfficerMutation = mutationOptions({
	mutationFn: createWorkspaceOfficerAccount,
});