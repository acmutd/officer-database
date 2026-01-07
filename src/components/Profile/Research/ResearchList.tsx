import { getOfficerByIdQuery, getOfficerQuery } from "@/queries/officer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import { ResearchCard } from "./ResearchCard";
import { AddResearch } from "./AddResearch";
import { useQuery } from "@tanstack/react-query";

type Props = {
	officerId?: string;
	archived?: boolean;
	editable?: boolean;
};

export function ResearchList({ officerId, archived = false, editable = false }: Props) {
	const { data: officer } = useQuery(
		officerId ? getOfficerByIdQuery(officerId, archived) : getOfficerQuery
	);

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl backdrop-blur-xl">
			<CardHeader
				className={
					editable ? "flex flex-row items-center justify-between space-y-0" : ""
				}
			>
				<div>
					<CardTitle className="text-xl font-semibold text-white">
						Research Experience
					</CardTitle>
					<CardDescription className="text-white/50">
						{editable
							? "Track your academic research and projects"
							: "Academic research and projects"}
					</CardDescription>
				</div>
				{editable && <AddResearch />}
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.research.map((research, index) => (
						<ResearchCard
							key={index}
							research={research}
							index={index}
							editable={editable}
						/>
					))}
					{officer?.research.length === 0 && (
						<p className="text-center text-white/50">
							{editable
								? "No research experience added yet"
								: "No research experience"}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
