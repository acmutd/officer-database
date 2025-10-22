import { Officer } from "@/schemas/officer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { ReadOnlyInternshipCard } from "./ReadOnlyInternshipCard";
import { getOfficerByIdQueryOptions } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";

type Props = {
	officerId: string;
};

export function ReadOnlyInternshipList({ officerId }: Props) {
	const { data: officer } = useQuery(getOfficerByIdQueryOptions(officerId));
	return (
		<Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader>
				<CardTitle className="text-xl font-semibold text-white">
					Internship Experience
				</CardTitle>
				<CardDescription className="text-white/50">
					Professional experience and internships
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.internships.map((internship, index) => (
						<ReadOnlyInternshipCard key={index} internship={internship} />
					))}
					{officer?.internships.length === 0 && (
						<p className="text-center text-white/50">
							No internships added yet
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
