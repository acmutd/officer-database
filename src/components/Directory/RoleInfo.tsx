import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RoleCard } from "./RoleCard";
import { AddRole } from "./AddRole";
import { useQuery } from "@tanstack/react-query";
import { isAdmin } from "@/lib/admin";
import { getOfficerQuery, getOfficerByIdQuery } from "@/queries/officer";

type Props = {
	officerId: string;
};

export function RoleInfo({ officerId }: Props) {
	const { data: officer } = useQuery(getOfficerByIdQuery(officerId));
	const { data: currentUser } = useQuery(getOfficerQuery);

	const canEdit = currentUser && isAdmin(currentUser);

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl backdrop-blur-xl">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<div>
					<CardTitle className="text-xl font-semibold text-white">
						Officer Roles
					</CardTitle>
					<CardDescription className="text-white/50">
						Track your positions and responsibilities
					</CardDescription>
				</div>
				{canEdit && <AddRole officerId={officerId} />}
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{officer?.roles.map((role, index) => (
						<RoleCard
							key={index}
							role={role}
							officerId={officerId}
							index={index}
						/>
					))}
					{officer?.roles.length === 0 && (
						<p className="text-center text-white/50">No roles added yet</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
