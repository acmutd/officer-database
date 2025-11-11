import { Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";

const activeLinkClasses =
	"text-white font-semibold underline decoration-2 underline-offset-[6px]";
const linkClasses =
	"text-white/80 font-medium transition-colors duration-200 hover:text-white";

export function Navbar() {
	const { logout } = useAuth();

	return (
		<nav className="fixed top-6 right-0 left-0 z-50 mx-auto flex max-w-2xl items-center justify-between gap-6 rounded-full bg-white/10 px-8 py-3.5 backdrop-blur-xl border border-white/30 shadow-xl shadow-black/10">
			<Link
				to="/"
				className="flex items-center shrink-0 transition-opacity duration-200 hover:opacity-80"
			>
				<img src="/acm.png" alt="ACM Logo" className="h-11" />
			</Link>

			<div className="flex items-center gap-10">
				<Link
					to="/"
					className={linkClasses}
					activeProps={{ className: activeLinkClasses }}
				>
					dashboard
				</Link>
				<Link
					to="/directory"
					className={linkClasses}
					activeProps={{ className: activeLinkClasses }}
				>
					directory
				</Link>
				<Link
					to="/profile"
					className={linkClasses}
					activeProps={{ className: activeLinkClasses }}
				>
					my profile
				</Link>
			</div>

			<button
				onClick={() => logout()}
				className="flex items-center justify-center shrink-0 h-10 w-10 rounded-full bg-white/15 text-white transition-all duration-200 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent"
				aria-label="Settings"
				title="Settings"
			>
				<Settings className="h-5 w-5" />
			</button>
		</nav>
	);
}
