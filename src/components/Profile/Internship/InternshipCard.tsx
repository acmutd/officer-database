import { Card, CardContent } from "@/components/ui/card";
import type { Internships } from "@/schemas/officer";
import { DeleteInternshipModal } from "./DeleteInternshipModal";
import { EditInternshipModal } from "./EditInternshipModal";
import { Briefcase, Calendar } from "lucide-react";

type Props = {
	internship: Internships;
	index?: number;
	editable?: boolean;
};

export function InternshipCard({ internship, index, editable = false }: Props) {
	return (
		<Card
			className={`${
				editable ? "group relative" : ""
			} border-white/10 bg-linear-to-br from-white/5 to-white/10 transition-colors hover:border-white/20`}
		>
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

				{editable && index !== undefined && (
					<div className="flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
						<EditInternshipModal internship={internship} index={index} />
						<DeleteInternshipModal internship={internship} index={index} />
					</div>
				)}
			</CardContent>
		</Card>
	);
}
