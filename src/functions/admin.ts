import {
	CreateWorkspaceOfficerResponseSchema,
	CreateWorkspaceOfficerSchema,
	type CreateWorkspaceOfficerRequest,
} from "@/schemas/admin";

const USER_MANAGEMENT_FUNCTION_URL =
	import.meta.env.VITE_PUBLIC_OFFICER_ONBOARD_ENDPOINT;

export async function createWorkspaceOfficerAccount(
	payload: CreateWorkspaceOfficerRequest
) {
	const parsedPayload = CreateWorkspaceOfficerSchema.parse(payload);

	if (!USER_MANAGEMENT_FUNCTION_URL) {
		throw new Error("Missing VITE_PUBLIC_OFFICER_ONBOARD_ENDPOINT");
	}

	const response = await fetch(USER_MANAGEMENT_FUNCTION_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(parsedPayload),
	});

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		const errorMessage =
			typeof data?.error === "string"
				? data.error
				: "Failed to create workspace account";
		throw new Error(errorMessage);
	}

	return CreateWorkspaceOfficerResponseSchema.parse(data);
}