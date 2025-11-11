import { auth } from "@/lib/firebase";

export async function fetchWithAuth(url: string, options: RequestInit) {
	const idToken = await auth.currentUser?.getIdToken();
	const userId = auth.currentUser?.uid;

	if (!idToken || !userId) {
		throw new Error("Unauthorized");
	}

	return fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${idToken}`,
			"X-User-Id": userId!,
		},
	});
}
