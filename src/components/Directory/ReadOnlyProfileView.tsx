"use client";
import { RoleList } from "../Profile/RoleList";
import { ExternalLinks } from "../Socials/ExternalLinks";
import { UserAvatar } from "../Profile/UserAvatar";
import { getOfficerByIdQueryOptions } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";

type Props = {
	officerId: string;
};

export function ReadOnlyProfileView({ officerId }: Props) {
	const { data: officer } = useQuery(getOfficerByIdQueryOptions(officerId));

	if (!officer) {
		return null;
	}
	return (
		<div className="col-span-2 space-y-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-10 shadow-xl backdrop-blur-xl">
			<div className="flex flex-col justify-between gap-12 md:flex-row">
				<div className="space-y-6">
					<div className="space-y-4">
						<h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
							{officer.firstName} {officer.lastName}
						</h1>
						<div className="flex flex-wrap items-center gap-3">
							<RoleList roles={officer.roles} showAll />
						</div>
					</div>
				</div>
				<div className="relative shrink-0">
					<UserAvatar
						firstName={officer.firstName}
						lastName={officer.lastName}
						src=""
					/>
				</div>
			</div>

			<ExternalLinks links={officer.socialLinks} />
		</div>
	);
}
