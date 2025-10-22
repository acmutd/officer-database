"use server";
import { Research } from "@/schemas/officer";
import { getCurrentOfficer } from "./officer";
import { fetchWithAuth } from "@/lib/fetch";

export async function addResearch({ research }: { research: Research }) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}
	const newResearch = [...officer.research, research];
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		{
			research: newResearch,
		}
	);
	return res;
}

export async function updateResearch({
	research,
	index,
}: {
	research: Research;
	index: number;
}) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}
	const newResearch = [...officer.research];
	newResearch[index] = research;
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		{
			research: newResearch,
		}
	);
	return res;
}

export async function deleteResearch({ index }: { index: number }) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}
	const newResearch = [...officer.research];
	newResearch.splice(index, 1);
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		{
			research: newResearch,
		}
	);
	return res;
}
