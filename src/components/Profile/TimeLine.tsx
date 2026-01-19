import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getOfficerByIdQuery } from "@/queries/officer";

type Props = {
	officerId: string;
};

export function TimeLine({ officerId }: Props) {
	const { data: officer } = useQuery(getOfficerByIdQuery(officerId));
	const sortedRoles = officer?.roles
		? [...officer.roles].sort((a, b) => {
				if (a.startDate.year !== b.startDate.year) {
					return b.startDate.year - a.startDate.year;
				}
				const termOrder = { Fall: 1, Spring: 2, Summer: 3 };
				return termOrder[b.startDate.term] - termOrder[a.startDate.term];
			})
		: [];

	return (
		<div className="space-y-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 shadow-xl backdrop-blur-xl">
			<h2 className="text-2xl font-bold tracking-tight text-white">
				Role History
			</h2>
			<div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-linear-to-b before:from-purple-500/50 before:via-purple-500/25 before:to-transparent">
				{sortedRoles.map((role, index) => (
					<div key={index} className="relative pl-8">
						<div className="absolute top-1/2 -left-2 h-3 w-3 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] ring-2 ring-purple-500/20" />
						<Card className="border border-white/10 bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/40">
							<CardHeader>
								<CardTitle className="text-lg font-bold text-white">
									{role.title}
								</CardTitle>
								<div className="text-muted-foreground text-sm">
									{role.division} • Level {role.level}
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-muted-foreground text-sm">
									{role.startDate.term} {role.startDate.year} -{" "}
									{role.endDate
										? `${role.endDate.term} ${role.endDate.year}`
										: "Present"}
								</div>
							</CardContent>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
}
