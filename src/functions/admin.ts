import {
	CreateWorkspaceOfficerResponseSchema,
	CreateWorkspaceOfficerSchema,
	type CreateWorkspaceOfficerRequest,
} from "@/schemas/admin";

const USER_MANAGEMENT_FUNCTION_URL =
	import.meta.env.VITE_PUBLIC_OFFICER_ONBOARD_ENDPOINT;
const DEFAULT_ONBOARD_ENDPOINT = "/api/onboard";

function getUserManagementEndpoint() {
	if (import.meta.env.DEV) {
		return DEFAULT_ONBOARD_ENDPOINT;
	}

	if (!USER_MANAGEMENT_FUNCTION_URL) {
		return DEFAULT_ONBOARD_ENDPOINT;
	}

	const trimmedEndpoint = USER_MANAGEMENT_FUNCTION_URL.replace(/\/+$/, "");
	const lowerEndpoint = trimmedEndpoint.toLowerCase();

	if (trimmedEndpoint.startsWith("/")) {
		return trimmedEndpoint;
	}

	if (
		lowerEndpoint.includes("cloudfunctions.net/") ||
		lowerEndpoint.endsWith("/user_management_http")
	) {
		return trimmedEndpoint;
	}

	return `${trimmedEndpoint}/user_management_http`;
}

export async function createWorkspaceOfficerAccount(
	payload: CreateWorkspaceOfficerRequest
) {
	const parsedPayload = CreateWorkspaceOfficerSchema.parse(payload);
	const endpoint = getUserManagementEndpoint();

	const response = await fetch(endpoint, {
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