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
		<nav className="fixed top-6 right-0 left-0 z-50 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-full bg-white/10 px-6 py-3 backdrop-blur-md border border-white/20 shadow-lg">
			<Link
				href="/"
				className="flex items-center transition-transform hover:scale-105"
			>
				<Image
					src="/acm.png"
					alt="ACM Logo"
					className="h-10"
					height={40}
					width={60}
				/>
			</Link>

			<div className="flex items-center gap-8">
				<Link
					href="/"
					className={`text-white font-medium transition-all duration-200 hover:text-white/90 hover:scale-105 ${
						pathname === "/" ? activeLinkClasses : ""
					}`}
				>
					dashboard
				</Link>
				<Link
					href="/directory"
					className={`text-white font-medium transition-all duration-200 hover:text-white/90 hover:scale-105 ${
						pathname.startsWith("/directory") ? activeLinkClasses : ""
					}`}
				>
					directory
				</Link>
				<Link
					href="/profile"
					className={`text-white font-medium transition-all duration-200 hover:text-white/90 hover:scale-105 ${
						pathname === "/profile" ? activeLinkClasses : ""
					}`}
				>
					my profile
				</Link>
			</div>

			<button
				onClick={() => signOut()}
				className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/20 hover:rotate-90 hover:scale-110"
				aria-label="Sign out"
			>
				<Settings className="h-5 w-5" />
			</button>
		</nav>
	);
}
