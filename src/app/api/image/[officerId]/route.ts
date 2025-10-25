import { fetchWithAuthFormData } from "@/lib/fetch";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

type RouteContext = {
	params: Promise<{ officerId: string }>;
};

export async function POST(req: Request, context: RouteContext) {
	try {
		const { user } = await getAuthenticatedAppForUser();
		if (!user.id || !user.name) {
			redirect("/login");
		}

		const data = await req.formData();
		const image = data.get("image");

		if (!image || !(image instanceof File)) {
			return NextResponse.json({ error: "No image provided" }, { status: 400 });
		}

		const res = await fetchWithAuthFormData(
			`${process.env.API_URL}/officers/${user.id}/image`,
			"POST",
			data
		);

		return NextResponse.json({ image: res.image });
	} catch (error) {
		console.error("Image upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload image" },
			{ status: 500 }
		);
	}
}
