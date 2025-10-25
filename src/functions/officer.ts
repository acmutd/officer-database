"use server";
import { Officer, OfficerSchema } from "@/schemas/officer";
import { redirect } from "next/navigation";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import z from "zod";
import { fetchWithAuth } from "@/lib/fetch";

export async function getOrCreateOfficer(
	userId: string,
	name: string,
	authParams?: { authIdToken: string; userId: string }
) {
	const officer = await getOfficer(userId, authParams);
	if (officer) {
		return officer;
	}
	const newOfficer = await createOfficer(userId, name, authParams);
	return newOfficer;
}

export async function getOfficer(
	userId: string,
	authParams?: { authIdToken: string; userId: string }
): Promise<Officer | null> {
	try {
		const officer = await fetchWithAuth(
			`${process.env.API_URL}/officers/${userId}`,
			"GET",
			undefined,
			authParams
		);
		return OfficerSchema.parse(officer);
	} catch (error) {
		console.error("Failed to fetch officer:", error);
		return null;
	}
}

const createOfficer = async (
	userId: string,
	name: string,
	authParams?: { authIdToken: string; userId: string }
): Promise<Officer> => {
	const [firstName, lastName] = name.split(" ");
	const newOfficer: Officer = {
		id: userId,
		firstName: firstName,
		lastName: lastName,
		netId: "xxxxxx",
		socialLinks: {},
		creditStanding: "Freshman",
		yearStanding: "Freshman",
		expectedGrad: {
			year: new Date().getFullYear() + 4,
			term: "Fall",
		},
		internships: [],
		research: [],
		accessLevel: 1,
		isActive: true,
		joinDate: {
			term: "Fall",
			year: new Date().getFullYear(),
		},
		roles: [],
	};
	const res = await fetchWithAuth(
		process.env.API_URL + "/officers",
		"POST",
		newOfficer,
		authParams
	);
	return OfficerSchema.parse(res);
};

export async function getCurrentOfficer() {
	const { user } = await getAuthenticatedAppForUser();
	if (!user || !user.id) {
		redirect("/login");
	}
	return await getOfficer(user.id);
}

export async function getAllOfficers() {
	const res = await fetchWithAuth(`${process.env.API_URL}/officers`, "GET");
	return z.array(OfficerSchema).parse(res);
}

export async function getOfficerAvatar(officerId: string): Promise<string> {
	try {
		const res = await fetchWithAuth(
			`${process.env.API_URL}/officers/${officerId}/image`,
			"GET"
		);
		return res.image ?? "/peechi.png";
	} catch (error) {
		console.error("Failed to fetch officer avatar:", error);
		return "/peechi.png";
	}
}
