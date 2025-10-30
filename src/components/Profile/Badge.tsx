import type { Role } from "@/schemas/officer";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Star } from "lucide-react";

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
};

type Props = {
	role: Role;
};

export function Badge({ role }: Props) {
	return (
		<HoverCard openDelay={100} closeDelay={100}>
			<HoverCardTrigger>
				<div className="group relative flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
					<div
						className={`${
							divisions[role.division as keyof typeof divisions]
						} relative z-10 flex items-center gap-2 bg-clip-text font-semibold text-transparent [-webkit-background-clip:text]`}
					>
						{role.title}
						{role.level === 2 && <Star className="h-4 w-4 text-white" />}
					</div>
				</div>
			</HoverCardTrigger>
			<HoverCardContent side="left" className="bg-black/60">
				<div className="space-y-2">
					<div>
						<h4 className="text-sm font-semibold text-white">{role.title}</h4>
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
