import { RoleList } from "./RoleList";
import { ExternalLinks } from "../Socials/ExternalLinks";
import { ImageUpdate } from "./ImageUpdate";
import { UserAvatar } from "./UserAvatar";
import { UpdateName } from "./UpdateName";
import { getOfficerQuery, getOfficerByIdQuery } from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";

type Props = {
	officerId?: string;
	editable?: boolean;
};

export function ProfileView({ officerId, editable = false }: Props) {
	const { data: officer } = useQuery(
		officerId ? getOfficerByIdQuery(officerId) : getOfficerQuery
	);

	if (!officer) {
		return null;
	}
	return (
		<div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
			<div className="flex flex-col items-center gap-6 text-center">
				{editable ? (
					<ImageUpdate
						officerId={officer.id}
						firstName={officer.firstName}
						lastName={officer.lastName}
					/>
				) : (
					<UserAvatar
						officerId={officer.id}
						firstName={officer.firstName}
						lastName={officer.lastName}
						className="shadow-2xl ring-4 ring-white/30"
					/>
				)}

				{editable ? (
					<UpdateName
						firstName={officer.firstName}
						lastName={officer.lastName}
					/>
				) : (
					<h1 className="text-2xl font-semibold tracking-tight text-white">
						{officer.firstName} {officer.lastName}
					</h1>
				)}

				<div className="flex flex-wrap justify-center gap-2 text-sm text-white/70">
					<RoleList roles={officer.roles} showAll />
				</div>
			</div>

			<div className="flex flex-col gap-4 pt-6">
				<span className="text-xs font-semibold uppercase text-white/60">
					Socials
				</span>
				<ExternalLinks links={officer.socialLinks} editable={editable} />
			</div>
		</div>
	);
}
