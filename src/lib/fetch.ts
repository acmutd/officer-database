import { getAuthenticatedAppForUser } from "./firebase/server";

export async function fetchWithAuth(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
	body?: any
) {
	const { auth, user } = await getAuthenticatedAppForUser();
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !user.id) {
		throw new Error("No ID token found");
	}
	const res = await fetch(url, {
		method,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
			"X-User-Id": user.id,
		},
	});
	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}
	return await res.json();
}
