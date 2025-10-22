import { Card, CardContent } from "@/components/ui/card";
import { Research } from "@/schemas/officer";
import { Calendar, FlaskConical, Users } from "lucide-react";

type Props = {
	research: Research;
};

export function ReadOnlyResearchCard({ research }: Props) {
	return (
		<Card className="border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.06] transition-colors hover:border-white/20">
			<CardContent className="flex items-start justify-between p-6">
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<FlaskConical className="h-4 w-4 text-white/30" />
						<h3 className="text-base font-medium text-white">
							{research.title}
						</h3>
						<span className="text-white/30">•</span>
						<p className="text-base text-white/70">{research.lab}</p>
					</div>
					<div className="flex items-center gap-3">
						<Users className="h-4 w-4 text-white/30" />
						<p className="text-sm text-white/50">
							{research.principalInvestigator.join(", ")}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="h-4 w-4 text-white/30" />
						<p className="text-sm text-white/50">
							{new Date(research.startDate).toLocaleDateString()}
							<span className="mx-2">→</span>
							<span
								className={
									research.endDate ? "text-white/50" : "text-emerald-400"
								}
							>
								{research.endDate
									? new Date(research.endDate).toLocaleDateString()
									: "Present"}
							</span>
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
