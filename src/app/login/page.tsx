import LoginButton from "@/components/LoginButton";
import { Navbar } from "@/components/Navbar";
import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await getAuthenticatedAppForUser();
	if (user.id !== null) {
		redirect("/");
	}

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center">
			<Navbar initialUserId={user.id} />
			<div className="flex w-full flex-col items-center space-y-12 px-8 py-12">
				<div className="flex flex-col items-center space-y-4">
					<Image src="/acm.png" alt="ACM Logo" width={112} height={77} />
					<h1 className="text-6xl font-bold text-white">officer database</h1>
				</div>

				<LoginButton />

				<p className="text-center text-3xl text-gray-400">
					sign in with your ACM email.
				</p>
			</div>
		</div>
	);
}
