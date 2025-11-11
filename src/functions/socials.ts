import { auth } from "@/lib/firebase";
import { OfficerSchema, type Officer } from "@/schemas/officer";
import { fetchWithAuth } from "./fetch";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

export async function updateSocials(data: Officer["socialLinks"]) {
	const id = auth.currentUser?.uid;
	if (!id) {
		throw new Error("Unauthorized");
	}
	const officer = await fetchWithAuth(`${API_URL}/officers/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ socialLinks: data }),
	});
	const res = await officer.json();
	return OfficerSchema.parse(res);
}
