"use client";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { onIdTokenChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "@/lib/firebase/client";
import { deleteCookie, setCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import Image from "next/image";

type Props = {
	initialUserId: string | null;
};

const activeLinkClasses = "underline underline-offset-4";

export function Navbar({ initialUserId }: Props) {
	useEffect(() => {
		return onIdTokenChanged(auth, async (user) => {
			if (user) {
				const idToken = await user.getIdToken();
				setCookie("__session", idToken);
			} else {
				deleteCookie("__session");
			}
			if (initialUserId === (user?.uid ?? null)) {
				return;
			} else {
				window.location.reload();
			}
		});
	}, [initialUserId]);

	const { signOut } = useAuth();
	const pathname = usePathname();

	if (!initialUserId) {
		return null;
	}
	return (
		<nav className="fixed top-6 right-0 left-0 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
			<div className="flex items-center gap-6">
				<Link href="/">
					<Image
						src="/acm.png"
						alt="ACM Logo"
						className="h-10"
						height={40}
						width={60}
					/>
				</Link>
				<Link
					href="/"
					className={`text-white ${pathname === "/" ? activeLinkClasses : ""}`}
				>
					dashboard
				</Link>
				<Link
					href="/directory"
					className={`text-white ${
						pathname === "/directory" ? activeLinkClasses : ""
					}`}
				>
					directory
				</Link>
				<Link
					href="/profile"
					className={`text-white ${
						pathname === "/profile" ? activeLinkClasses : ""
					}`}
				>
					my profile
				</Link>
				<button onClick={() => signOut()} className="cursor-pointer text-white">
					<Settings className="h-5 w-5" />
				</button>
			</div>
		</nav>
	);
}
