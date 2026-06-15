import { auth } from "@/lib/firebase";

type AuthenticatedUser = {
	uid: string;
	getIdToken: () => Promise<string>;
};

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
const inflightGetRequests = new Map<string, Promise<Response>>();

export type Endpoint =
	| "/createOfficer"
	| `/getOfficer?id=${string}`
	| `/getOfficer?id=${string}&archived=true`
	| "/getOfficers"
	| "/getOfficers?archived=true"
	| `/updateOfficer?id=${string}`
	| `/updateOfficer?id=${string}&archived=true`
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

	const method = options.method?.toUpperCase() ?? "GET";
	const requestUrl = `${API_URL}${endpoint}`;

	if (method === "GET") {
		const requestKey = `${userId}:${requestUrl}`;
		const existingRequest = inflightGetRequests.get(requestKey);

		if (existingRequest) {
			const existingResponse = await existingRequest;
			return existingResponse.clone();
		}

		const requestPromise = fetch(requestUrl, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${idToken}`,
				"X-User-Id": userId,
			},
		});

		inflightGetRequests.set(requestKey, requestPromise);

		try {
			const response = await requestPromise;
			return response.clone();
		} finally {
			inflightGetRequests.delete(requestKey);
		}
	}

	return fetch(requestUrl, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${idToken}`,
			"X-User-Id": userId,
		},
	});
}

export async function fetchWithAuthForUser(
	user: AuthenticatedUser,
	endpoint: Endpoint,
	options: RequestInit
) {
	const idToken = await user.getIdToken();
	const method = options.method?.toUpperCase() ?? "GET";
	const requestUrl = `${API_URL}${endpoint}`;

	if (method === "GET") {
		const requestKey = `${user.uid}:${requestUrl}`;
		const existingRequest = inflightGetRequests.get(requestKey);

		if (existingRequest) {
			const existingResponse = await existingRequest;
			return existingResponse.clone();
		}

		const requestPromise = fetch(requestUrl, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${idToken}`,
				"X-User-Id": user.uid,
			},
		});

		inflightGetRequests.set(requestKey, requestPromise);

		try {
			const response = await requestPromise;
			return response.clone();
		} finally {
			inflightGetRequests.delete(requestKey);
		}
	}

	return fetch(requestUrl, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${idToken}`,
			"X-User-Id": user.uid,
		},
	});
}
