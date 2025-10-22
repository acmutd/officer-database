"use client";
import { getCurrentOfficerQueryOptions } from "@/queries/officer";
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

export function InternshipList() {
	const { data: officer } = useQuery(getCurrentOfficerQueryOptions);
	return (
		<Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle className="text-xl font-semibold text-white">
						Internship Experience
					</CardTitle>
					<CardDescription className="text-white/50">
						Track your professional experience and internships
					</CardDescription>
				</div>
				<AddInternship />
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.internships.map((internship, index) => (
						<InternshipCard key={index} internship={internship} index={index} />
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
