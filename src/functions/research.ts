import { fetchWithAuth } from "./fetch";
import { getAuthorizedOfficerId, getOfficerById } from "./officer";
import { OfficerSchema, type Research } from "@/schemas/officer";

export async function deleteResearch({
	officerId,
	index,
}: {
	officerId?: string;
	index: number;
}) {
	const id = await getAuthorizedOfficerId(officerId);
	const officer = await getOfficerById(id);
	if (!officer) throw new Error("Officer not found");
	const newResearch = [...officer.research];
	newResearch.splice(index, 1);
	const res = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ research: newResearch }),
	});

	const data = await res.json();
	return OfficerSchema.parse(data);
}

export async function updateResearch({
	officerId,
	index,
	data,
}: {
	officerId?: string;
	index: number;
	data: Research;
}) {
	const id = await getAuthorizedOfficerId(officerId);
	const officer = await getOfficerById(id);
	if (!officer) throw new Error("Officer not found");
	const newResearch = [...officer.research];
	newResearch[index] = data;
	const res = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ research: newResearch }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
}

export async function addResearch({
	officerId,
	data,
}: {
	officerId?: string;
	data: Research;
}) {
	const id = await getAuthorizedOfficerId(officerId);

	const officer = await getOfficerById(id);
	if (!officer) throw new Error("Officer not found");
	const newResearch = [...officer.research, data];
	const res = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ research: newResearch }),
	});
	const newData = await res.json();
	return OfficerSchema.parse(newData);
}
