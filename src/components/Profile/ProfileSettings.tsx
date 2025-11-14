import { EditSocials } from "./Socials/EditSocials";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { getOfficerQuery } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";

export function ProfileSettings() {
	const { data: officer } = useQuery(getOfficerQuery);
	if (!officer) {
		return null;
	}
	return (
		<div className="space-y-6">
			<Card className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 shadow-xl backdrop-blur-xl">
				<CardHeader>
					<CardTitle className="text-xl font-semibold text-white">
						Social Links
					</CardTitle>
					<CardDescription className="text-white/50">
						Manage your professional and social media presence
					</CardDescription>
				</CardHeader>
				<CardContent>
					<EditSocials links={officer.socialLinks} />
				</CardContent>
			</Card>
		</div>
	);
}
