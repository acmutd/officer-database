import type { Role } from "@/schemas/officer";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Crown, ShieldCheck } from "lucide-react";

const divisions = {
	Media: "bg-media-gradient",
	Research: "bg-research-gradient",
	Development: "bg-development-gradient",
	Projects: "bg-projects-gradient",
	Education: "bg-education-gradient",
	Executive: "bg-white",
	Community: "bg-community-gradient",
	HackUTD: "bg-hackutd-gradient",
	Industry: "bg-industry-gradient",
	Finance: "bg-finance-gradient",
};

type Props = {
	role: Role;
};

function getAuthorityIcon(level: number) {
	switch (level) {
		case 3:
			return <Crown className="h-4 w-4 text-yellow-400" />;
		case 2:
			return <ShieldCheck className="h-4 w-4 text-purple-400" />;
		default:
			return null;
	}
}

export function Badge({ role }: Props) {
	const icon = getAuthorityIcon(role.level);

	return (
		<HoverCard openDelay={100} closeDelay={100}>
			<HoverCardTrigger onClick={(e) => e.stopPropagation()}>
				<div className="group relative flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-black/55 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
					<div
						className={`${
							divisions[role.division as keyof typeof divisions]
						} relative z-10 flex items-center gap-2 bg-clip-text font-semibold text-transparent [-webkit-background-clip:text]`}
					>
						{role.division}
					</div>
					{icon && <div className="relative z-10">{icon}</div>}
				</div>
			</HoverCardTrigger>
			<HoverCardContent side="right" className="bg-black/80">
				<div className="space-y-2">
					<div>
						<h4 className="text-sm font-semibold text-white">
							{role.title}
						</h4>
						<p className="text-muted-foreground text-sm">
							{role.division} Division
						</p>
					</div>
					<div className="text-muted-foreground border-border/30 border-t pt-2 text-xs">
						{role.startDate.term} {role.startDate.year} -{" "}
						{role.endDate
							? role.endDate.term + " " + role.endDate.year
							: "Present"}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
