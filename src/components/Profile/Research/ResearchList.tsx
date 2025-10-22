"use client";
import { Officer } from "@/schemas/officer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import { ResearchCard } from "./ResearchCard";
import { AddResearch } from "./AddResearch";
import { getCurrentOfficerQueryOptions } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";

export function ResearchList() {
	const { data: officer } = useQuery(getCurrentOfficerQueryOptions);
	return (
		<Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle className="text-xl font-semibold text-white">
						Research Experience
					</CardTitle>
					<CardDescription className="text-white/50">
						Track your academic research and projects
					</CardDescription>
				</div>
				<AddResearch />
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.research.map((research, index) => (
						<ResearchCard key={index} research={research} index={index} />
					))}
					{officer?.research.length === 0 && (
						<p className="text-center text-white/50">
							No research experience added yet
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
