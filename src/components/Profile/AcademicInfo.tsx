import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import UpdateAcademics from "./UpdateAcademics";
import { getOfficerByIdQuery, getOfficerQuery } from "@/queries/officer";

type Props = {
	officerId?: string;
	archived?: boolean;
	editable?: boolean;
};

export function AcademicInfo({ officerId, archived = false, editable = false }: Props) {
	const { data: officer } = useQuery(
		officerId ? getOfficerByIdQuery(officerId, archived) : getOfficerQuery
	);

	if (!officer) {
		return null;
	}

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl backdrop-blur-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Academic Information
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				{editable ? (
					<UpdateAcademics officer={officer} />
				) : (
					<div className="space-y-8">
						<div className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
							<div className="text-sm font-medium tracking-wider text-white/50 uppercase">
								Net ID
							</div>
							<div className="mt-2 text-lg font-medium text-white">
								{officer.netId}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
								<div className="text-sm font-medium tracking-wider text-white/50 uppercase">
									Year Standing
								</div>
								<div className="mt-2 text-lg font-medium text-white">
									{officer.yearStanding}
								</div>
							</div>
							<div className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
								<div className="text-sm font-medium tracking-wider text-white/50 uppercase">
									Credit Standing
								</div>
								<div className="mt-2 text-lg font-medium text-white">
									{officer.creditStanding}
								</div>
							</div>
						</div>

						<div className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
							<div className="text-sm font-medium tracking-wider text-white/50 uppercase">
								Expected Graduation
							</div>
							<div className="mt-2 text-lg font-medium text-white">
								{officer.expectedGrad.term} {officer.expectedGrad.year}
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
