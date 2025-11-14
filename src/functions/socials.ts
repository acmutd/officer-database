import { auth } from "@/lib/firebase";
import { OfficerSchema, type Officer } from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";

export async function updateSocials(data: Officer["socialLinks"]) {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await fetchWithAuth(`/updateOfficer?id=${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ socialLinks: data }),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}
