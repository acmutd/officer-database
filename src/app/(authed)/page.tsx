import { getAuthenticatedAppForUser } from "@/lib/firebase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await getAuthenticatedAppForUser();
	if (!user.id) {
		redirect("/login");
	}
	return (
		<div className="mx-auto flex w-full justify-between px-16 pt-20">
			<div className="flex w-1/2 items-center gap-8">
				<div>
					<h1 className="mb-2 text-6xl font-bold text-white lowercase">
						welcome back, <br /> {user.name}
					</h1>
					<Image
						src="/peechi.png"
						alt="Peechi"
						className="w-4/5"
						width={200}
						height={200}
						priority
					/>
				</div>
			</div>
			<div className="flex w-1/2 flex-col rounded-2xl bg-white/10 px-8 ">
				<div className="mb-4 w-1/3 self-center rounded-b-2xl bg-white/10 p-4 pt-0">
					<h2 className="my-2 text-center text-2xl font-bold text-white">
						my quick links
					</h2>
				</div>
			</div>
		</div>
	);
}
