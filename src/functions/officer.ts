import { auth } from "@/lib/firebase";
import { OfficerSchema, type Officer } from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";

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
	const res = await fetchWithAuth(`/getOfficer?id=${officerId}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

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

export async function getAllOfficers(): Promise<Officer[]> {
	const officers = await fetchWithAuth(`/getOfficers`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await officers.json();
	return OfficerSchema.array().parse(data);
}

const createDefaultOfficer = (officerId: string, name: string): Officer => {
	return {
		id: officerId,
		firstName: name.split(" ")[0],
		lastName: name.split(" ")[1],
		netId: "xxx123456",
		resume: "",
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
	};
};
