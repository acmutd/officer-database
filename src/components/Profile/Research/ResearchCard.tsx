import { Card, CardContent } from "@/components/ui/card";
import type { Research } from "@/schemas/officer";
import { Calendar, FlaskConical, Users } from "lucide-react";
import { DeleteResearchModal } from "./DeleteResearchModal";
import { EditResearchModal } from "./EditResearchModal";

const formatDate = (value: string) =>
	new Date(value).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

type Props = {
	officerId?: string;
	research: Research;
	index?: number;
	editable?: boolean;
};

export function ResearchCard({ officerId, research, index, editable = false }: Props) {
	return (
		<Card
			className={`${
				editable ? "group relative" : ""
			} border-white/10 bg-gradient-to-br from-white/5 to-white/10 transition-colors hover:border-white/20`}
		>
			<CardContent className="flex items-start justify-between p-6">
				<div className="space-y-3">
					<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
						<div className="flex items-center gap-3">
							<FlaskConical className="h-4 w-4 text-white/30 shrink-0" />
							<h3 className="text-base font-medium text-white">
								{research.title}
							</h3>
						</div>
						<span className="hidden sm:inline text-white/30">•</span>
						<p className="text-base text-white/70 pl-7 sm:pl-0">{research.lab}</p>
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
							{formatDate(research.startDate)}
							<span className="mx-2">→</span>
							<span
								className={
									research.endDate ? "text-white/50" : "text-emerald-400"
								}
							>
								{research.endDate ? formatDate(research.endDate) : "Present"}
							</span>
						</p>
					</div>
				</div>

				{editable && index !== undefined && (
					<div className="flex gap-1 opacity-100 md:opacity-0 transition-opacity duration-200 md:group-hover:opacity-100">
						<EditResearchModal officerId={officerId} research={research} index={index} />
						<DeleteResearchModal officerId={officerId} research={research} index={index} />
					</div>
				)}
			</CardContent>
		</Card>
	);
}
