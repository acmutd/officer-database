import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	ClipboardCheck,
	Info,
	LayoutDashboard,
	LogOut,
	Menu,
	User,
	Users,
	X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getOfficerImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { getOfficerQuery } from "@/queries/officer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type AppShellProps = {
	children: React.ReactNode;
};

const SIDEBAR_MODE_STORAGE_KEY = "officer-db-sidebar-collapsed";

const navLinks = [
	{
		label: "Dashboard",
		to: "/dashboard" as const,
		icon: LayoutDashboard,
	},
	{
		label: "Directory",
		to: "/directory" as const,
		icon: Users,
	},
	{
		label: "Resources",
		to: "/resources" as const,
		icon: Info,
	},
	{
		label: "Onboarding",
		to: "/onboarding" as const,
		icon: ClipboardCheck,
		requiresAdmin: true,
	},
];

function ProfileMenu() {
	const { user, logout } = useAuth();
	const [open, setOpen] = React.useState(false);
	const { data: officer } = useQuery({
		...getOfficerQuery,
		staleTime: 60000,
	});

	const fullName =
		officer?.firstName && officer?.lastName
			? `${officer.firstName} ${officer.lastName}`
			: user?.displayName || "Officer";
	const initials = fullName
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const officerImage = officer?.photo?.url ? getOfficerImageUrl(officer.photo) : undefined;
	const profilePhoto = officerImage || user?.photoURL || undefined;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<button
					className="rounded-full border border-white/20 bg-black/30 p-0.5 transition-colors hover:bg-black/45"
					aria-label="Open profile menu"
					title="Profile menu"
				>
					<Avatar className="h-9 w-9 border border-white/10">
						{profilePhoto && <AvatarImage src={profilePhoto} alt={fullName} />}
						<AvatarFallback className="bg-white/15 text-xs font-semibold text-white">
							{initials || "OF"}
						</AvatarFallback>
					</Avatar>
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={10}
				className="w-56 border-white/15 bg-black/90 p-2 text-white backdrop-blur-md"
			>
				<div className="border-b border-white/10 px-2 pb-2">
					<p className="truncate text-sm font-semibold text-white">{fullName}</p>
					<p className="text-xs text-white/70">Account</p>
				</div>
				<div className="mt-2 space-y-1">
					<Link
						to="/profile"
						onClick={() => setOpen(false)}
						className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
					>
						<User className="h-4 w-4" />
						Profile
					</Link>
					<button
						onClick={async () => {
							setOpen(false);
							await logout();
						}}
						className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-white"
					>
						<LogOut className="h-4 w-4" />
						Log out
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export function AppShell({ children }: AppShellProps) {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const { data: officer } = useQuery(getOfficerQuery);
	const [desktopCollapsed, setDesktopCollapsed] = React.useState(() => {
		if (typeof window === "undefined") {
			return false;
		}

		return window.localStorage.getItem(SIDEBAR_MODE_STORAGE_KEY) === "true";
	});
	const pathname = useRouterState({ select: (state) => state.location.pathname });

	React.useEffect(() => {
		window.localStorage.setItem(SIDEBAR_MODE_STORAGE_KEY, String(desktopCollapsed));
	}, [desktopCollapsed]);

	const userIsAdmin = officer ? isAdmin(officer) : false;
	const visibleNavLinks = navLinks.filter((item) => !item.requiresAdmin || userIsAdmin);

	const pageTitle = pathname.startsWith("/directory")
		? "Directory"
		: pathname.startsWith("/dashboard")
			? "Dashboard"
		: pathname.startsWith("/resources")
			? "Resources"
		: pathname.startsWith("/onboarding")
			? "Onboarding"
			: "My Profile";

	return (
		<div className="relative min-h-screen overflow-x-clip text-white">
			<div className="relative min-h-screen">
				<aside
					className={cn(
						"fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] border-r border-white/10 bg-black/50 backdrop-blur-md lg:flex lg:flex-col",
						desktopCollapsed ? "w-14" : "w-48"
					)}
				>
					<nav className={cn("space-y-2 py-4", desktopCollapsed ? "px-2" : "px-3")}>
						{visibleNavLinks.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								activeProps={{
									className:
										"border-white/30 bg-white/10 text-white",
								}}
								className={cn(
									"flex w-full border border-transparent text-white/80 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white",
									desktopCollapsed
										? "mx-auto h-9 w-9 items-center justify-center rounded-lg p-0"
										: "-ml-0.5 h-9 items-center rounded-lg p-0 text-left"
								)}
								title={desktopCollapsed ? item.label : undefined}
							>
								<span className="flex h-9 w-9 shrink-0 items-center justify-center">
									<item.icon className="h-4 w-4" />
								</span>
								{!desktopCollapsed && (
									<span className="block pr-3 text-sm font-medium">{item.label}</span>
								)}
							</Link>
						))}
					</nav>
				</aside>

				{mobileOpen && (
					<div className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
				)}
				<aside
					className={cn(
						"fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 max-w-[88vw] border-r border-white/10 bg-black/95 px-4 py-5 transition-transform duration-300 lg:hidden",
						mobileOpen ? "translate-x-0" : "-translate-x-full"
					)}
				>
					<div className="mb-6 flex items-center justify-between">
						<Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-1 py-1 text-white transition-colors hover:bg-white/10">
							<img src="/acm.png" alt="ACM" className="h-6 w-6 rounded-sm object-contain" />
						</Link>
						<button
							onClick={() => setMobileOpen(false)}
							className="rounded-lg border border-white/20 p-2 text-white"
							aria-label="Close menu"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
					<nav className="space-y-2">
						{visibleNavLinks.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								onClick={() => setMobileOpen(false)}
								activeProps={{ className: "border-white/30 bg-white/10 text-white" }}
								className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left text-white/80"
							>
								<item.icon className="h-4 w-4 shrink-0" />
								<span className="block text-sm font-medium">{item.label}</span>
							</Link>
						))}
					</nav>
				</aside>

				<div className="min-w-0 flex flex-1 flex-col">
					<header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/45 pr-4 backdrop-blur-md sm:pr-6 lg:pr-8">
						<div className="flex min-w-0 items-center">
							<div className="flex shrink-0 items-center gap-3 pl-2 sm:pl-3 lg:gap-4">
							<button
								onClick={() => setMobileOpen(true)}
								className="rounded-lg border border-white/15 p-2 text-white lg:hidden"
								aria-label="Open menu"
							>
								<Menu className="h-4 w-4" />
							</button>
							<button
								onClick={() => setDesktopCollapsed((prev) => !prev)}
								className="hidden rounded-lg border border-white/15 p-2 text-white transition-colors hover:bg-white/10 lg:inline-flex"
								aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
								title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							>
								<Menu className="h-4 w-4" />
							</button>
							<Link to="/" className="shrink-0 rounded-sm transition-opacity hover:opacity-90" aria-label="Go to home">
								<img src="/acm.png" alt="ACM" className="h-7 w-7 shrink-0 rounded-sm object-contain" />
							</Link>
							</div>
							<div className="ml-3 min-w-0 sm:ml-4">
								<p className="text-xs uppercase tracking-[0.2em] text-white/60">ACM UTD Officer Database</p>
								<h2 className="truncate text-lg font-semibold text-white">{pageTitle}</h2>
							</div>
						</div>

						<ProfileMenu />
					</header>

					<main className={cn("flex-1 px-2 py-5 sm:px-3 lg:px-4 lg:py-8", desktopCollapsed ? "lg:pl-16" : "lg:pl-52")}>
						<div className="w-full">{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
