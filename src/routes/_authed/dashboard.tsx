import { ACMErrorComponent } from "@/components/ErrorComponent";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/lib/auth";
import { getOfficerQuery } from "@/queries/officer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { CheckCircle2, CircleDashed, ClipboardList, Sparkles } from "lucide-react";

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
			title: "Add at least one experience",
			description: "Share an internship or research item to strengthen your profile",
			done: officer.internships.length > 0 || officer.research.length > 0,
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

	return (
		<div className="space-y-6 px-4 pb-20 md:px-6">
			<section className="rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-7">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="flex items-center gap-2 text-sm text-white/65">
							<Sparkles className="h-4 w-4" />
							Dashboard (WIP)
						</p>
						<h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Welcome, {firstName}</h1>
						<p className="mt-2 text-sm text-white/70">Here is your quick snapshot and a few things to knock out this week.</p>
					</div>
					<div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
						{completedCount}/{tasks.length} tasks completed
					</div>
				</div>
			</section>

			<section className="grid gap-4 lg:grid-cols-3">
				<div className="rounded-2xl border border-white/10 bg-black/30 p-5 lg:col-span-2">
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

				<div className="rounded-2xl border border-white/10 bg-black/30 p-5">
					<h2 className="text-lg font-semibold text-white">Quick Links</h2>
					<div className="mt-4 space-y-2 text-sm">
						<Link to="/resources" className="block rounded-lg border border-white/10 px-3 py-2 text-white/80 hover:bg-white/5">
							Open resources
						</Link>
						<Link to="/directory" className="block rounded-lg border border-white/10 px-3 py-2 text-white/80 hover:bg-white/5">
							Browse officer directory
						</Link>
						<Link to="/profile" className="block rounded-lg border border-white/10 px-3 py-2 text-white/80 hover:bg-white/5">
							Edit my profile
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
