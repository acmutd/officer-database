import { auth } from "@/lib/firebase";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

type Endpoint =
	| "/createOfficer"
	| `/getOfficer?id=${string}`
	| "/getOfficers"
	| "/getOfficers?archived=true"
	| `/updateOfficer?id=${string}`
	| `/archiveOfficer?id=${string}`
	| `/unarchiveOfficer?id=${string}`
	| "/uploadOfficerPhoto"
	| "/uploadOfficerResume"
	| `/getOfficerResume?id=${string}`;
export async function fetchWithAuth(endpoint: Endpoint, options: RequestInit) {
	const idToken = await auth.currentUser?.getIdToken();
	const userId = auth.currentUser?.uid;

	if (!idToken || !userId) {
		throw new Error("Unauthorized");
	}

	return fetch(`${API_URL}${endpoint}`, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${idToken}`,
			"X-User-Id": userId!,
		},
	});
}
