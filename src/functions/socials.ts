import { OfficerSchema, type Officer } from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";
import { getAuthorizedOfficerId } from "./officer";

export async function updateSocials({
	officerId,
	socialLinks,
}: {
	officerId?: string;
	socialLinks: Officer["socialLinks"];
}) {
	const id = await getAuthorizedOfficerId(officerId);
	const officer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ socialLinks }),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}
