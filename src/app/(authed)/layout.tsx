import { Navbar } from "@/components/Navbar";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await getAuthenticatedAppForUser();
	if (!user || !user.officer) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen">
			<div className="flex w-full justify-center">
				<Navbar initialUserId={user.id} />
			</div>

			<main className="px-4 pt-32">{children}</main>
		</div>
	);
}
