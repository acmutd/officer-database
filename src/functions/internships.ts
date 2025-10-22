"use server";
import { Internships } from "@/schemas/officer";
import { getCurrentOfficer } from "./officer";
import { fetchWithAuth } from "@/lib/fetch";

export async function updateInternship({
	internship,
	index,
}: {
	internship: Internships;
	index: number;
}) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}

	const newInternships = [...officer.internships];
	newInternships[index] = internship;

	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		{
			internships: newInternships,
		}
	);
	return res;
}

export async function deleteInternship({ index }: { index: number }) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}
	const newInternships = [...officer.internships];
	newInternships.splice(index, 1);
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		{
			internships: newInternships,
		}
	);
	return res;
}

export async function addInternship({
	internship,
}: {
	internship: Internships;
}) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}
	const newInternships = [...officer.internships, internship];
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		{
			internships: newInternships,
		}
	);
	return res;
}
