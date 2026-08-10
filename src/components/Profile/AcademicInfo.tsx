import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import UpdateAcademics, { type UpdateAcademicsHandle } from "./UpdateAcademics";
import { getOfficerByIdQuery, getOfficerQuery } from "@/queries/officer";
import type { Officer } from "@/schemas/officer";
import { CalendarDays, GraduationCap } from "lucide-react";

type Props = {
	officerId?: string;
	archived?: boolean;
	editable?: boolean;
	variant?: "card" | "inline";
	hideSubmitButton?: boolean;
	academicFormRef?: React.Ref<UpdateAcademicsHandle>;
	onDirtyChange?: (dirty: boolean) => void;
};

function AcademicContent({ officer }: { officer: Officer }) {
	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/45">
					<GraduationCap className="h-3 w-3" />
					Year Standing
				</div>
				<div className="text-sm text-white">
					{officer.yearStanding}
				</div>
			</div>

			<div className="space-y-1">
				<div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/45">
					<CalendarDays className="h-3 w-3" />
					Expected Graduation
				</div>
				<div className="text-sm text-white">
					{officer.expectedGrad.term} {officer.expectedGrad.year}
				</div>
			</div>
		</div>
	);
}

export function AcademicInfo({
	officerId,
	archived = false,
	editable = false,
	variant = "card",
	hideSubmitButton = false,
	academicFormRef,
	onDirtyChange,
}: Props) {
	const { data: officer } = useQuery(
		officerId ? getOfficerByIdQuery(officerId, archived) : getOfficerQuery
	);

	if (!officer) {
		return null;
	}

	const content = editable ? (
		<UpdateAcademics
			officer={officer}
			showSubmitButton={!hideSubmitButton}
			ref={academicFormRef}
			onDirtyChange={onDirtyChange}
		/>
	) : (
		<AcademicContent officer={officer} />
	);

	if (variant === "inline") {
		return (
			<div className="space-y-4">
				<span className="text-xs font-semibold uppercase text-white/60">
					Academic Information
				</span>
				{content}
			</div>
		);
	}

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Academic Information
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">{content}</CardContent>
		</Card>
	);
}
