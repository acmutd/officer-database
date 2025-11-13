import { auth } from "@/lib/firebase";
import { fetchWithAuth } from "./fetch";
import { getCurrentOfficer } from "./officer";
import { OfficerSchema, type Research } from "@/schemas/officer";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export async function deleteResearch(index: number) {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newResearch = [...officer.research];
	newResearch.splice(index, 1);
	const res = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ research: newResearch }),
	});

	const data = await res.json();
	return OfficerSchema.parse(data);
}

export async function updateResearch({
	index,
	data,
}: {
	index: number;
	data: Research;
}) {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newResearch = [...officer.research];
	newResearch[index] = data;
	const res = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ research: newResearch }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
}

export async function addResearch(data: Research) {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}

	const officer = await getCurrentOfficer();
	if (!officer) throw new Error("Officer not found");
	const newResearch = [...officer.research, data];
	const res = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ research: newResearch }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
}
