import {
	OfficerSchema,
	type Internships,
	type Officer,
} from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";
import { auth } from "@/lib/firebase";
import { getCurrentOfficer } from "./officer";

export async function addInternship(data: Internships): Promise<Officer> {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}

	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newInternships = [...officer.internships, data];
	const newOfficer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
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
	const newInternships = [...officer.internships];
	newInternships.splice(index, 1);
	const res = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ internships: newInternships }),
	});

	const data = await res.json();

	return OfficerSchema.parse(data);
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
	const newInternships = [...officer.internships];
	newInternships[index] = data;
	const res = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ internships: newInternships }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
}
