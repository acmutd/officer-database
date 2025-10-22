"use server";
import { Officer } from "@/schemas/officer";
import { getCurrentOfficer } from "./officer";
import { fetchWithAuth } from "@/lib/fetch";

export async function updateAcademicInfo({
	academicInfo,
}: {
	academicInfo: Pick<
		Officer,
		"netId" | "creditStanding" | "yearStanding" | "expectedGrad"
	>;
}) {
	const officer = await getCurrentOfficer();
	if (!officer) {
		throw new Error("Officer not found");
	}
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${officer.id}`,
		"PATCH",
		academicInfo
	);
	return res;
}
