import { getOfficerByIdQuery, getOfficerQuery } from "@/queries/officer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import { AddInternship } from "./AddInternship";
import { InternshipCard } from "./InternshipCard";
import { useQuery } from "@tanstack/react-query";

type Props = {
	officerId?: string;
	editable?: boolean;
};

export function InternshipList({ officerId, editable = false }: Props) {
	const { data: officer } = useQuery(
		officerId ? getOfficerByIdQuery(officerId) : getOfficerQuery
	);

	return (
		<Card className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader
				className={
					editable ? "flex flex-row items-center justify-between space-y-0" : ""
				}
			>
				<div>
					<CardTitle className="text-xl font-semibold text-white">
						Internship Experience
					</CardTitle>
					<CardDescription className="text-white/50">
						{editable
							? "Track your professional experience and internships"
							: "Professional experience and internships"}
					</CardDescription>
				</div>
				{editable && <AddInternship />}
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.internships.map((internship, index) => (
						<InternshipCard
							key={index}
							internship={internship}
							index={index}
							editable={editable}
						/>
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
