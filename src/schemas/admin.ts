import { z } from "zod";

export const CreateWorkspaceOfficerSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	org_unit_path: z.string().min(1, "Org unit path is required"),
	groups: z.array(z.email("Enter valid group emails")).default([]),
	send_to_email: z.email("Enter a valid personal email"),
});

export type CreateWorkspaceOfficerRequest = z.infer<
	typeof CreateWorkspaceOfficerSchema
>;

export const CreateWorkspaceOfficerResponseSchema = z.object({
	message: z.string(),
	created_user: z.unknown(),
	added_groups: z.array(z.string()).default([]),
	failed_groups: z
		.array(
			z.object({
				group: z.string(),
				error: z.string(),
			})
		)
		.default([]),
});

export type CreateWorkspaceOfficerResponse = z.infer<
	typeof CreateWorkspaceOfficerResponseSchema
>;