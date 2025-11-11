import {
	OfficerSchema,
	type Internships,
	type Officer,
} from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";
import { auth } from "@/lib/firebase";
import { getCurrentOfficer } from "./officer";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export async function addInternship(data: Internships): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}

	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newInternships = [...officer.internships, data];
	const newOfficer = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ internships: newInternships }),
	});
	const res = await newOfficer.json();
	return OfficerSchema.parse(res);
}

export async function deleteInternship(index: number): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newInternships = officer.internships.splice(index, 1);
	const res = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ internships: newInternships }),
	});
	return OfficerSchema.parse(res);
}

export async function updateInternship({
	index,
	data,
}: {
	index: number;
	data: Internships;
}): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newInternships = officer.internships.splice(index, 1, data);
	const res = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ internships: newInternships }),
	});
	return OfficerSchema.parse(res);
}
