import { auth } from "@/lib/firebase";
import { OfficerSchema, type Officer } from "@/schemas/officer";
import { fetchWithAuth, fetchWithAuthForUser } from "./fetch";
import type { Endpoint } from "./fetch";
import { isExecutive } from "@/lib/admin";

type OfficerNameParts = {
	firstName: string;
	lastName: string;
};

type CreateOfficerRequestBody = {
	id: string;
	firstName: string;
	lastName: string;
	netId: string;
	socialLinks: {
		linkedin?: string;
		github?: string;
		instagram?: string;
		personalEmail?: string;
	};
	creditStanding: Officer["creditStanding"];
	yearStanding: Officer["yearStanding"];
	expectedGrad: Officer["expectedGrad"];
	internships: Officer["internships"];
	research: Officer["research"];
	joinDate: Officer["joinDate"];
	roles: Officer["roles"];
	accessLevel: Officer["accessLevel"];
	displayOnWebsite: boolean;
	isActive: Officer["isActive"];
	isArchived: Officer["isArchived"];
	photo: Officer["photo"];
};

function splitDisplayName(name: string): OfficerNameParts {
	const normalized = name.trim();
	if (!normalized) {
		return {
			firstName: "Unknown",
			lastName: "Unknown",
		};
	}

	const [firstName = "Unknown", ...rest] = normalized.split(/\s+/);

	return {
		firstName,
		lastName: rest.join(" ") || firstName,
	};
}

function getOfficerNameParts(user: {
	displayName: string | null;
	email: string | null;
	uid: string;
}): OfficerNameParts {
	if (user.displayName?.trim()) {
		return splitDisplayName(user.displayName);
	}

	if (user.email?.trim()) {
		const localPart = user.email.split("@")[0] ?? user.uid;
		return splitDisplayName(localPart.replace(/[._-]+/g, " "));
	}

	return splitDisplayName(user.uid);
}

export async function getCurrentOfficer(): Promise<Officer | null> {
	const idToken = await auth.currentUser?.getIdToken();
	const userId = auth.currentUser?.uid;

	if (!idToken || !userId) {
		throw new Error("Unauthorized");
	}
	return getOfficerById(userId);
}

async function createOfficer(): Promise<Officer> {
	const id = auth.currentUser?.uid;
	const name = auth.currentUser?.displayName;
	if (!id || !name) {
		throw new Error("Unauthorized");
	}
	const officer = await fetchWithAuth(`/createOfficer`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(createDefaultOfficer(id, splitDisplayName(name))),
	});
	const data = await officer.json();
	return OfficerSchema.parse(data);
}

export async function getOrCreateOfficer(): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}

	let officer = await getOfficerById(id);

	if (!officer) {
		officer = await getOfficerById(id, true);
	}

	if (!officer) {
		return createOfficer();
	}

	return officer;
}

export async function getOrCreateOfficerForUser(user: {
	uid: string;
	displayName: string | null;
	email: string | null;
	getIdToken: () => Promise<string>;
}): Promise<Officer> {
	let officer = await getOfficerByIdForUser(user, user.uid);

	if (!officer) {
		officer = await getOfficerByIdForUser(user, user.uid, true);
	}

	if (!officer) {
		const officerResponse = await fetchWithAuthForUser(user, `/createOfficer`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(createDefaultOfficer(user.uid, getOfficerNameParts(user))),
		});

		const data = await officerResponse.json();
		return OfficerSchema.parse(data);
	}

	return officer;
}

export async function getOfficerById(
	officerId: string,
	archived = false
): Promise<Officer | null> {
	const endpoint = archived
		? (`/getOfficer?id=${officerId}&archived=true` as const)
		: (`/getOfficer?id=${officerId}` as const);

	const res = await fetchWithAuth(endpoint, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		// If officer not found in officers collection and we haven't checked archived yet,
		// try checking the archived collection
		if (res.status === 404 && !archived) {
			return getOfficerById(officerId, true);
		}
		console.error(res.statusText);
		return null;
	}
	const data = await res.json();
	return OfficerSchema.parse(data);
}

async function getOfficerByIdForUser(
	user: {
		uid: string;
		getIdToken: () => Promise<string>;
	},
	officerId: string,
	archived = false
): Promise<Officer | null> {
	const endpoint = archived
		? (`/getOfficer?id=${officerId}&archived=true` as const)
		: (`/getOfficer?id=${officerId}` as const);

	const res = await fetchWithAuthForUser(user, endpoint, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		if (res.status === 404 && !archived) {
			return getOfficerByIdForUser(user, officerId, true);
		}
		console.error(res.statusText);
		return null;
	}

	const data = await res.json();
	return OfficerSchema.parse(data);
}

export async function updateOfficerName(
	data: Pick<Officer, "firstName" | "lastName"> & { officerId?: string }
): Promise<Officer> {
	const { officerId, ...payload } = data;
	const id = await getAuthorizedOfficerId(officerId);
	const officer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}

export async function updateAcademicInfo(
	data: Pick<
		Officer,
		"netId" | "creditStanding" | "yearStanding" | "expectedGrad"
	> & { officerId?: string }
): Promise<Officer> {
	const { officerId, ...payload } = data;
	const id = await getAuthorizedOfficerId(officerId);
	const officer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}

export async function updateOfficerStatus({
	officerId,
	isActive,
	isArchived,
}: {
	officerId: string;
	isActive: boolean;
	isArchived?: boolean;
}): Promise<Officer> {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) throw new Error("Current user not found");
	if (!isExecutive(currentUser)) throw new Error("Unauthorized");

	const endpoint = isArchived
		? `/updateOfficer?id=${officerId}&archived=true`
		: `/updateOfficer?id=${officerId}`;

	const officer = await fetchWithAuth(endpoint as Endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ isActive }),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}

export async function getAllOfficers({
	archived = false,
}: { archived?: boolean } = {}): Promise<Officer[]> {
	const endpoint = archived ? "/getOfficers?archived=true" : "/getOfficers";
	const officers = await fetchWithAuth(endpoint as Endpoint, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!officers.ok) {
		const message = await officers.text();
		throw new Error(message || "Failed to fetch officers");
	}

	const data = await officers.json();
	return OfficerSchema.array().parse(data);
}

export async function archiveOfficer(officerId: string): Promise<Officer> {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) throw new Error("Current user not found");
	if (!isExecutive(currentUser)) throw new Error("Unauthorized");

	const res = await fetchWithAuth(`/archiveOfficer?id=${officerId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const message = await res.text();
		throw new Error(message || "Failed to archive officer");
	}

	const data = await res.json();
	return OfficerSchema.parse(data);
}

export async function unarchiveOfficer(officerId: string): Promise<Officer> {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) throw new Error("Current user not found");
	if (!isExecutive(currentUser)) throw new Error("Unauthorized");

	const res = await fetchWithAuth(`/unarchiveOfficer?id=${officerId}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const message = await res.text();
		throw new Error(message || "Failed to unarchive officer");
	}

	const data = await res.json();
	return OfficerSchema.parse(data);
}

const createDefaultOfficer = (
	officerId: string,
	nameParts: OfficerNameParts
): CreateOfficerRequestBody => {
	return {
		id: officerId,
		firstName: nameParts.firstName,
		lastName: nameParts.lastName,
		netId: "xxx123456",
		socialLinks: {
			linkedin: undefined,
			github: undefined,
			instagram: undefined,
			personalEmail: undefined,
		},
		creditStanding: "Freshman",
		yearStanding: "Freshman",
		expectedGrad: {
			term: "Fall",
			year: 2025,
		},
		internships: [],
		research: [],
		joinDate: {
			term: "Fall",
			year: 2025,
		},
		roles: [],
		accessLevel: 1,
		displayOnWebsite: false,
		isActive: true,
		isArchived: false,
		photo: {},
	};
};

export async function updateOfficerImage({
	officerId,
	file,
}: {
	officerId: string;
	file: File;
}) {
	if (!file) {
		console.error("No image provided");
		throw new Error("No image provided");
	}

	const authorizedOfficerId = await getAuthorizedOfficerId(officerId);

	const formData = new FormData();
	formData.append("id", authorizedOfficerId);
	formData.append("file", file);

	const res = await fetchWithAuth("/uploadOfficerPhoto", {
		method: "POST",
		body: formData,
	});
	const imageUrl = await res.json();
	return imageUrl;
}

export async function uploadOfficerResume({
	officerId,
	file,
}: {
	officerId: string;
	file: File;
}) {
	if (!file) {
		console.error("No file provided");
		throw new Error("No file provided");
	}

	const authorizedOfficerId = await getAuthorizedOfficerId(officerId);

	const formData = new FormData();
	formData.append("id", authorizedOfficerId);
	formData.append("file", file);

	const res = await fetchWithAuth("/uploadOfficerResume", {
		method: "POST",
		body: formData,
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.error || "Failed to upload resume");
	}
}

export async function getAuthorizedOfficerId(officerId?: string): Promise<string> {
	const currentUserId = auth.currentUser?.uid;
	if (!currentUserId) {
		throw new Error("Unauthorized");
	}

	if (!officerId || officerId === currentUserId) {
		return currentUserId;
	}

	const currentOfficer = await getCurrentOfficer();
	if (!currentOfficer || !isExecutive(currentOfficer)) {
		throw new Error("Unauthorized");
	}

	return officerId;
}

export async function getOfficerResumeUrl(officerId: string): Promise<string> {
	const res = await fetchWithAuth(`/getOfficerResume?id=${officerId}`, {
		method: "GET",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch resume");
	}

	const data = await res.json();
	if (!data.resumeUrl) {
		throw new Error("Resume URL not found");
	}
	return data.resumeUrl;
}
