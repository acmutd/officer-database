import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	ArrowLeft,
	Building2,
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
];

const adminNavLinks = [
	{
		label: "Onboarding",
		to: "/onboarding" as const,
		icon: ClipboardCheck,
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
					className={cn(
						"group relative rounded-full border border-white/20 bg-black/30 p-0.5 transition-all duration-200 ease-out will-change-transform hover:border-white/45 hover:bg-black/45 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.08)] active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
						open && "border-white/50 bg-black/55 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
					)}
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
	const visibleNavLinks = navLinks;
	const visibleAdminNavLinks = userIsAdmin ? adminNavLinks : [];

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
		<div className="relative h-screen overflow-hidden text-white">
			<div className="relative flex h-full overflow-hidden">
				<aside
					className={cn(
						"fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] border-r border-white/10 bg-black/50 backdrop-blur-md transition-[width] duration-300 ease-in-out lg:flex lg:flex-col",
						desktopCollapsed ? "w-14" : "w-48"
					)}
				>
					<nav className={cn("flex-1 space-y-2 overflow-y-auto py-4 transition-all duration-300 ease-in-out", desktopCollapsed ? "px-2" : "px-3")}>
						{visibleNavLinks.map((item) => (
							<Link
								key={item.label}
								to={item.to}
								activeProps={{
									className:
										"border-white/30 bg-white/10 text-white",
								}}
								className={cn(
									"flex w-full border border-transparent text-white/80 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/5 hover:text-white",
									desktopCollapsed
										? "mx-auto h-9 w-9 items-center justify-center rounded-lg p-0"
										: "-ml-0.5 h-9 items-center rounded-lg p-0 text-left"
								)}
								title={desktopCollapsed ? item.label : undefined}
							>
								<span
									className={cn(
										"flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 ease-in-out",
										desktopCollapsed ? "translate-x-0" : "-translate-x-px"
									)}
								>
									<item.icon className="h-4 w-4" />
								</span>
								<span
									className={cn(
										"block overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,opacity,transform,padding] duration-300 ease-in-out",
										desktopCollapsed
											? "max-w-0 translate-x-1 pr-0 opacity-0"
											: "max-w-40 translate-x-0 pr-3 opacity-100"
									)}
								>
									{item.label}
								</span>
							</Link>
						))}

						{visibleAdminNavLinks.length > 0 && (
							<>
								<div className={cn("my-2 border-t border-white/15", desktopCollapsed ? "mx-1" : "mx-0.5")} />
								{!desktopCollapsed && (
									<p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
										Admin Section
									</p>
								)}
								{visibleAdminNavLinks.map((item) => (
									<Link
										key={item.label}
										to={item.to}
										activeProps={{
											className: "border-white/30 bg-white/10 text-white",
										}}
										className={cn(
											"flex w-full border border-transparent text-white/80 transition-all duration-300 ease-in-out hover:border-white/20 hover:bg-white/5 hover:text-white",
											desktopCollapsed
												? "mx-auto h-9 w-9 items-center justify-center rounded-lg p-0"
												: "-ml-0.5 h-9 items-center rounded-lg p-0 text-left"
										)}
										title={desktopCollapsed ? item.label : undefined}
									>
										<span
											className={cn(
												"flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 ease-in-out",
												desktopCollapsed ? "translate-x-0" : "-translate-x-px"
											)}
										>
											<item.icon className="h-4 w-4" />
										</span>
										<span
											className={cn(
												"block overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,opacity,transform,padding] duration-300 ease-in-out",
												desktopCollapsed
													? "max-w-0 translate-x-1 pr-0 opacity-0"
													: "max-w-40 translate-x-0 pr-3 opacity-100"
											)}
										>
											{item.label}
										</span>
									</Link>
								))}
								<button
									disabled
									aria-disabled="true"
									className={cn(
										"flex w-full border border-dashed border-white/20 text-white/45 transition-all duration-300 ease-in-out",
										desktopCollapsed
											? "mx-auto h-9 w-9 items-center justify-center rounded-lg p-0"
											: "-ml-0.5 h-9 items-center rounded-lg p-0 text-left",
										"cursor-not-allowed"
									)}
									title={desktopCollapsed ? "ACM HR (Coming Soon)" : undefined}
								>
									<span
										className={cn(
											"flex h-9 w-9 shrink-0 items-center justify-center transition-transform duration-300 ease-in-out",
											desktopCollapsed ? "translate-x-0" : "-translate-x-px"
										)}
									>
										<Building2 className="h-4 w-4" />
									</span>
									<span
										className={cn(
											"block overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,opacity,transform,padding] duration-300 ease-in-out",
											desktopCollapsed
												? "max-w-0 translate-x-1 pr-0 opacity-0"
												: "max-w-40 translate-x-0 pr-3 opacity-100"
										)}
									>
										ACM HR
									</span>
								</button>
							</>
						)}
					</nav>
					<div className={cn("border-t border-white/10 py-3", desktopCollapsed ? "px-2" : "px-3")}>
						<button
							onClick={() => setDesktopCollapsed((prev) => !prev)}
							className={cn(
								"flex h-9 w-full items-center rounded-lg border border-white/15 bg-white/5 text-white/90 transition-colors hover:bg-white/10",
								"justify-center"
							)}
							aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							<ArrowLeft
								className={cn(
									"h-4 w-4 transition-transform duration-300 ease-in-out",
									desktopCollapsed ? "rotate-180" : "rotate-0"
								)}
							/>
						</button>
					</div>
				</aside>

				<div
					className={cn(
						"fixed inset-x-0 bottom-0 top-16 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out lg:hidden",
						mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
					)}
					onClick={() => setMobileOpen(false)}
				/>
				<aside
					className={cn(
						"fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-72 max-w-[88vw] overflow-y-auto border-r border-white/10 bg-black/95 px-4 py-5 transition-transform duration-300 ease-in-out lg:hidden",
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

						{visibleAdminNavLinks.length > 0 && (
							<>
								<div className="my-3 border-t border-white/15" />
								<p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
									Admin Section
								</p>
								{visibleAdminNavLinks.map((item) => (
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
								<button
									disabled
									aria-disabled="true"
									className="flex w-full cursor-not-allowed items-center gap-3 rounded-2xl border border-dashed border-white/20 px-3 py-3 text-left text-white/45"
									title="ACM HR (Coming Soon)"
								>
									<Building2 className="h-4 w-4 shrink-0" />
									<span className="block text-sm font-medium">ACM HR</span>
								</button>
							</>
						)}
					</nav>
				</aside>

				<div className="min-h-0 min-w-0 flex h-full flex-1 flex-col">
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

					<main className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-5 transition-[padding-left] duration-300 ease-in-out sm:px-3 lg:px-4 lg:py-8", desktopCollapsed ? "lg:pl-16" : "lg:pl-52")}>
						<div className="w-full">{children}</div>
					</main>
				</div>
			</div>
		</div>
	);
}
