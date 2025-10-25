import { getAuthenticatedAppForUser } from "./firebase/server";

export async function fetchWithAuth(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	body?: any
) {
	const { authIdToken, user } = await getAuthenticatedAppForUser();

	if (!authIdToken || !user.id) {
		console.error("No ID token found");
		return null;
	}
	const res = await fetch(url, {
		method,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${authIdToken}`,
			"X-User-Id": user.id,
		},
	});
	if (!res.ok) {
		console.error(await res.text(), res.status);
		throw new Error("Failed to fetch data");
	}
	return await res.json();
}

export async function fetchWithAuthFormData(
	url: string,
	method: string,
	data: FormData
) {
	const { authIdToken, user } = await getAuthenticatedAppForUser();
	if (!authIdToken || !user.id) {
		throw new Error("No ID token found");
	}
	const res = await fetch(url, {
		method,
		body: data,
		headers: {
			Authorization: `Bearer ${authIdToken}`,
			"X-User-Id": user.id,
		},
	});
	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}
	return await res.json();
}
