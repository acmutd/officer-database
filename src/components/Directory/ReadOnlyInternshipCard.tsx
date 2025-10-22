import { Card, CardContent } from "@/components/ui/card";
import { Internships } from "@/schemas/officer";
import { Briefcase, Calendar } from "lucide-react";

type Props = {
	internship: Internships;
};

export function ReadOnlyInternshipCard({ internship }: Props) {
	return (
		<Card className="border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.06]">
			<CardContent className="flex items-start justify-between p-6">
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<Briefcase className="h-4 w-4 text-white/30" />
						<h3 className="text-base font-medium text-white">
							{internship.title}
						</h3>
						<span className="text-white/30">•</span>
						<p className="text-base text-white/70">{internship.company}</p>
					</div>
					<div className="flex items-center gap-3">
						<Calendar className="h-4 w-4 text-white/30" />
						<p className="text-sm text-white/50">
							{internship.startDate}
							<span className="mx-2">→</span>
							<span
								className={
									internship.endDate ? "text-white/50" : "text-emerald-400"
								}
							>
								{internship.endDate || "Present"}
							</span>
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
