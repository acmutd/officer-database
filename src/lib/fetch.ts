import { getAuthenticatedAppForUser } from "./firebase/server";

export async function fetchWithAuth(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	body?: any,
	authParams?: { authIdToken: string; userId: string }
) {
	let authIdToken: string;
	let userId: string;

	if (authParams) {
		authIdToken = authParams.authIdToken;
		userId = authParams.userId;
	} else {
		const { authIdToken: token, user } = await getAuthenticatedAppForUser();
		if (!token || !user) {
			console.error("No ID token found");
			return null;
		}
		authIdToken = token;
		userId = user.id;
	}

	if (!authIdToken || !userId) {
		console.error("No ID token found");
		return null;
	}

	const res = await fetch(url, {
		method,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${authIdToken}`,
			"X-User-Id": userId,
		},
		cache: "no-store",
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
	data: FormData,
	authParams?: { authIdToken: string; userId: string }
) {
	let authIdToken: string;
	let userId: string;

	if (authParams) {
		authIdToken = authParams.authIdToken;
		userId = authParams.userId;
	} else {
		const { authIdToken: token, user } = await getAuthenticatedAppForUser();
		if (!token || !user) {
			throw new Error("No ID token found");
		}
		authIdToken = token;
		userId = user.id;
	}

	if (!authIdToken || !userId) {
		throw new Error("No ID token found");
	}
	const res = await fetch(url, {
		method,
		body: data,
		headers: {
			Authorization: `Bearer ${authIdToken}`,
			"X-User-Id": userId,
		},
		cache: "no-store",
	});
	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}
	return await res.json();
}
