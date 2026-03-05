import { ACMErrorComponent } from "@/components/ErrorComponent";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/lib/auth";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
	CheckCircle2,
	Clock3,
	CircleDashed,
	ClipboardList,
	IdCard,
	Milestone,
} from "lucide-react";

export const Route = createFileRoute("/_authed/dashboard")({
	component: RouteComponent,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(getOfficerQuery);
	},
	errorComponent: ACMErrorComponent,
	pendingComponent: Spinner,
});

type TaskItem = {
	title: string;
	description: string;
	done: boolean;
	href: "/profile" | "/directory" | "/resources";
};

function RouteComponent() {
	const { data: officer } = useSuspenseQuery(getOfficerQuery);
	const { user } = useAuth();

	if (!officer) {
		return <Navigate to="/login" />;
	}

	const firstName = officer.firstName || user?.displayName?.split(" ")[0] || "Officer";
	const socialLinksCount = Object.values(officer.socialLinks ?? {}).filter((value) =>
		Boolean(value?.trim())
	).length;
	const termOrder: Record<"Spring" | "Summer" | "Fall", number> = {
		Spring: 0,
		Summer: 1,
		Fall: 2,
	};

	const sortedRoles = [...officer.roles].sort((a, b) => {
		if (a.startDate.year !== b.startDate.year) {
			return b.startDate.year - a.startDate.year;
		}
		return termOrder[b.startDate.term] - termOrder[a.startDate.term];
	});
	const activeRoles = sortedRoles.filter((role) => role.endDate === null);
	const hasMultipleActiveRoles = activeRoles.length > 1;
	const fallbackRole = sortedRoles[0];
	const accessLevelLabel =
		officer.accessLevel === 3 ? "Executive" : officer.accessLevel === 2 ? "Director" : "Officer";

	const resumeDate = officer.resumeUpdatedAt ? new Date(officer.resumeUpdatedAt) : null;
	const resumeAgeDays = resumeDate
		? Math.floor((Date.now() - resumeDate.getTime()) / (1000 * 60 * 60 * 24))
		: null;
	const resumeFreshness =
		resumeAgeDays === null
			? "No resume uploaded"
			: resumeAgeDays <= 45
				? "Resume looks fresh"
				: resumeAgeDays <= 120
					? "Resume may need a refresh soon"
					: "Resume is likely stale";
	const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const formatTerm = (term: { term: "Fall" | "Spring" | "Summer"; year: number }) =>
		`${term.term} ${term.year}`;

	const tasks: TaskItem[] = [
		{
			title: "Upload your profile photo",
			description: "Add a profile image so everyone can recognize you",
			done: Boolean(officer.photo?.url?.trim()),
			href: "/profile",
		},
		{
			title: "Update your academic information",
			description: "Confirm standing, graduation term, and basics are current",
			done: Boolean(officer.creditStanding && officer.yearStanding && officer.expectedGrad?.year),
			href: "/profile",
		},
		{
			title: "Add your LinkedIn",
			description: "Include your LinkedIn profile in social links so officers can connect",
			done: Boolean(officer.socialLinks?.linkedin?.trim()),
			href: "/profile",
		},
		{
			title: "Upload latest resume",
			description: "Keep your resume fresh for internal opportunities",
			done: Boolean(officer.resumeUpdatedAt),
			href: "/profile",
		},
	];

	const completedCount = tasks.filter((task) => task.done).length;
	const hour = new Date().getHours();
	const timeGreeting =
		hour >= 5 && hour < 12
			? "Good morning"
			: hour >= 12 && hour < 17
				? "Good afternoon"
				: hour >= 17 && hour < 21
					? "Good evening"
					: "Good night";
	const timeEmoji =
		hour >= 5 && hour < 12
			? "🌅"
			: hour >= 12 && hour < 17
				? "🏙️"
				: hour >= 17 && hour < 21
					? "🌇"
					: "🌆";

	return (
		<div className="space-y-6 px-4 pb-20 md:px-6">
			<section className="rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-7">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{timeGreeting}, {firstName} {timeEmoji}</h1>
						<p className="mt-2 text-sm text-white/70">Here is your quick snapshot and a few things to knock out this week.</p>
					</div>
					<div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
						{completedCount}/{tasks.length} tasks completed
					</div>
				</div>
			</section>

			<section className="grid gap-4 lg:grid-cols-3">
				<div className="order-2 rounded-2xl border border-white/10 bg-black/30 p-5 lg:order-2 lg:col-span-1">
					<h2 className="flex items-center gap-2 text-lg font-semibold text-white">
						<ClipboardList className="h-5 w-5" />
						Tasks To Do
					</h2>
					<div className="mt-4 space-y-3">
						{tasks.map((task) => (
							<Link
								key={task.title}
								to={task.href}
								className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
							>
								{task.done ? (
									<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
								) : (
									<CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-white/45" />
								)}
								<span>
									<span className="block text-sm font-medium text-white">{task.title}</span>
									<span className="block text-xs text-white/65">{task.description}</span>
								</span>
							</Link>
						))}
					</div>
				</div>

				<div className="order-1 rounded-2xl border border-white/10 bg-black/30 p-5 lg:order-1 lg:col-span-2">
					<h2 className="flex items-center gap-2 text-lg font-semibold text-white">
						<IdCard className="h-5 w-5" />
						My ACM Snapshot
					</h2>
					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-2">
							<p className="text-xs uppercase tracking-wide text-white/60">
								{hasMultipleActiveRoles ? "Current roles" : "Current role"}
							</p>
							{activeRoles.length > 0 ? (
								<div className="mt-2 space-y-2">
									{activeRoles.map((role) => (
										<div key={`${role.title}-${role.division}-${role.startDate.term}-${role.startDate.year}`} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
											<p className="text-sm font-semibold text-white">{role.title}</p>
											<p className="text-xs text-white/65">{role.division} Division</p>
										</div>
									))}
								</div>
							) : (
								<>
									<p className="mt-1 text-lg font-semibold text-white">
										{fallbackRole?.title ?? "No role assigned"}
									</p>
									<p className="text-xs text-white/65">
										{fallbackRole ? `${fallbackRole.division} Division` : "Ask leadership to update your role"}
									</p>
								</>
							)}
							{hasMultipleActiveRoles && (
								<p className="mt-2 text-xs text-amber-300/90">Multiple active roles detected.</p>
							)}
							<div className="mt-3 flex items-center justify-between text-xs text-white/70">
								<span className="rounded-full border border-white/15 px-2 py-1">{accessLevelLabel}</span>
								<span>Joined {formatTerm(officer.joinDate)}</span>
							</div>
						</div>

						<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
							<p className="flex items-center gap-2 text-sm font-medium text-white">
								<Milestone className="h-4 w-4" />
								Timeline
							</p>
							<div className="mt-3 space-y-2 text-xs text-white/75">
								<p>Expected graduation: {formatTerm(officer.expectedGrad)}</p>
								<p>
									Latest resume update:{" "}
									{resumeDate ? fullDateFormatter.format(resumeDate) : "No resume uploaded"}
								</p>
								<p>
									Profile photo updated:{" "}
									{officer.photo?.lastUpdatedAt
										? fullDateFormatter.format(new Date(officer.photo.lastUpdatedAt))
										: "No photo upload yet"}
								</p>
							</div>
						</div>

						<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
							<p className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
								<Clock3 className="h-3.5 w-3.5" />
								Presence and freshness
							</p>
							<p className="mt-1 text-xs text-white/80">{resumeFreshness}</p>
							<div className="mt-2 grid grid-cols-3 gap-2 text-center">
								<div className="rounded-lg border border-white/10 px-2 py-2">
									<p className="text-lg font-semibold text-white">{officer.internships.length}</p>
									<p className="text-[11px] text-white/60">Internships</p>
								</div>
								<div className="rounded-lg border border-white/10 px-2 py-2">
									<p className="text-lg font-semibold text-white">{officer.research.length}</p>
									<p className="text-[11px] text-white/60">Research</p>
								</div>
								<div className="rounded-lg border border-white/10 px-2 py-2">
									<p className="text-lg font-semibold text-white">{socialLinksCount}</p>
									<p className="text-[11px] text-white/60">Social links</p>
								</div>
							</div>
							<Link
								to="/directory/$userId"
								params={{ userId: officer.id }}
								className="mt-3 block rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-white/80 hover:bg-white/5"
							>
								Preview directory profile
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
