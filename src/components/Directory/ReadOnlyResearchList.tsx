import { Officer } from "@/schemas/officer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ReadOnlyResearchCard } from "./ReadOnlyResearchCard";
import { useQuery } from "@tanstack/react-query";
import { getOfficerByIdQueryOptions } from "@/queries/officer";

type Props = {
	officerId: string;
};

export function ReadOnlyResearchList({ officerId }: Props) {
	const { data: officer } = useQuery(getOfficerByIdQueryOptions(officerId));
	return (
		<Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader>
				<CardTitle className="text-xl font-semibold text-white">
					Research Experience
				</CardTitle>
				<CardDescription className="text-white/50">
					Academic research and projects
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.research.map((research, index) => (
						<ReadOnlyResearchCard key={index} research={research} />
					))}
					{officer?.research.length === 0 && (
						<p className="text-center text-white/50">No research experience</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
