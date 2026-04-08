import { useMemo } from "react";

import type { SocialLinks } from "@/schemas/officer";
import { Button } from "@/components/ui/button";
import { LinkedInLink } from "./LinkedInLink";
import { GithubLink } from "./GithubLink";
import { InstagramLink } from "./InstagramLink";
import { EmailLink } from "./EmailLink";
import { EditSocials } from "@/components/Profile/Socials/EditSocials";

type Props = {
	officerId?: string;
	links: SocialLinks;
	editable?: boolean;
	isEditing?: boolean;
	compact?: boolean;
	onEditRequest?: () => void;
	onCancelEdit?: () => void;
	onFinishEdit?: () => void;
};

export function ExternalLinks({
	officerId,
	links,
	editable = false,
	isEditing = false,
	compact = false,
	onEditRequest,
	onCancelEdit,
	onFinishEdit,
}: Props) {
	const hasLinks = useMemo(
		() => Boolean(links.linkedin || links.github || links.instagram || links.personalEmail),
		[links.github, links.instagram, links.linkedin, links.personalEmail]
	);

	if (!editable) {
		return (
			<div className="flex flex-col gap-2 items-start">
				{links.linkedin && <LinkedInLink url={links.linkedin} />}
				{links.github && <GithubLink url={links.github} />}
				{links.instagram && <InstagramLink url={links.instagram} />}
				{links.personalEmail && <EmailLink url={links.personalEmail} />}
				{!hasLinks && (
					<span className="text-sm text-white/60">
						No social links yet. :'(
					</span>
				)}
			</div>
		);
	}

	if (isEditing) {
		return (
			<EditSocials
				officerId={officerId}
				links={links}
				onCancel={onCancelEdit}
				onSuccess={onFinishEdit}
			/>
		);
	}

	return (
			<div className={compact ? "flex flex-col gap-2 items-start" : "flex flex-col gap-4 items-start"}>
				{hasLinks ? (
					<>
						{links.linkedin && <LinkedInLink url={links.linkedin} />}
						{links.github && <GithubLink url={links.github} />}
						{links.instagram && <InstagramLink url={links.instagram} />}
						{links.personalEmail && <EmailLink url={links.personalEmail} />}
					</>
				) : (
					<span className="text-sm text-white/60">
						No social links yet. Add one below.
					</span>
				)}
				{editable && onEditRequest && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className={
							compact
								? "mt-1 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
								: "border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
						}
						onClick={onEditRequest}
					>
						Edit Profile
					</Button>
				)}
			</div>
	);
}
