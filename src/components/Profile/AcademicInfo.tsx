"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import UpdateAcademics from "./UpdateAcademics";
import { getCurrentOfficerQueryOptions } from "@/queries/officer";

export function AcademicInfo() {
	const { data: officer } = useQuery(getCurrentOfficerQueryOptions);
	return (
		<Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Academic Information
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				{officer && <UpdateAcademics officer={officer} />}
			</CardContent>
		</Card>
	);
}
