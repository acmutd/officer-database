"use server";
import { SocialLinks } from "@/schemas/officer";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { fetchWithAuth } from "@/lib/fetch";

export async function updateUserSocials({ socials }: { socials: SocialLinks }) {
	const { user } = await getAuthenticatedAppForUser();
	if (!user || !user.officer) {
		throw new Error("User not authenticated");
	}
	const res = await fetchWithAuth(
		`${process.env.API_URL}/officers/${user.id}`,
		"PATCH",
		{
			socialLinks: socials,
		}
	);
	return res;
}
