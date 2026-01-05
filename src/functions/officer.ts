import { auth } from "@/lib/firebase";
import { OfficerSchema, type Officer } from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";
import { isExecutive } from "@/lib/admin";

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
		body: JSON.stringify(createDefaultOfficer(id, name)),
	});
	const data = await officer.json();
	return OfficerSchema.parse(data);
}

export async function getOrCreateOfficer(): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await getOfficerById(id);
	if (!officer) {
		return createOfficer();
	}
	return officer;
}

export async function getOfficerById(
	officerId: string
): Promise<Officer | null> {
	// First try to get the officer normally
	let res = await fetchWithAuth(`/getOfficer?id=${officerId}` as const, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	// If not found, try to get archived officer
	if (!res.ok) {
		res = await fetchWithAuth(`/getOfficer?id=${officerId}&archived=true` as const, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	if (!res.ok) {
		console.error(res.statusText);
		return null;
	}
	const data = await res.json();
	return OfficerSchema.parse(data);
}

export async function updateOfficerName(
	data: Pick<Officer, "firstName" | "lastName">
): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}

export async function updateAcademicInfo(
	data: Pick<
		Officer,
		"netId" | "creditStanding" | "yearStanding" | "expectedGrad"
	>
): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}

export async function updateOfficerStatus({
	officerId,
	isActive,
}: {
	officerId: string;
	isActive: boolean;
}): Promise<Officer> {
	const currentUser = await getCurrentOfficer();
	if (!currentUser) throw new Error("Current user not found");
	if (!isExecutive(currentUser)) throw new Error("Unauthorized");

	const officer = await fetchWithAuth(`/updateOfficer?id=${officerId}`, {
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
	const officers = await fetchWithAuth(endpoint as any, {
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
		body: JSON.stringify({ id: officerId }),
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
		body: JSON.stringify({ id: officerId }),
	});

	if (!res.ok) {
		const message = await res.text();
		throw new Error(message || "Failed to unarchive officer");
	}

	const data = await res.json();
	return OfficerSchema.parse(data);
}

const createDefaultOfficer = (officerId: string, name: string): Officer => {
	return {
		id: officerId,
		firstName: name.split(" ")[0],
		lastName: name.split(" ")[1],
		netId: "xxx123456",
		socialLinks: {
			linkedin: undefined,
			github: undefined,
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
		isActive: true,
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

	const formData = new FormData();
	formData.append("id", officerId);
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

	const formData = new FormData();
	formData.append("id", officerId);
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
