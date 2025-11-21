import { useEffect, useMemo, useState } from "react";

import type { SocialLinks } from "@/schemas/officer";
import { Button } from "@/components/ui/button";
import { LinkedInLink } from "./LinkedInLink";
import { GithubLink } from "./GithubLink";
import { EmailLink } from "./EmailLink";
import { EditSocials } from "@/components/Profile/Socials/EditSocials";

type Props = {
	links: SocialLinks;
	editable?: boolean;
};

export function ExternalLinks({ links, editable = false }: Props) {
	const hasLinks = useMemo(
		() => Boolean(links.linkedin || links.github || links.personalEmail),
		[links.github, links.linkedin, links.personalEmail]
	);

	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!editable) {
			setIsEditing(false);
		}
	}, [editable]);

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSuccess = () => {
		setIsEditing(false);
	};

	if (!editable) {
		return (
			<div className="flex flex-col gap-2 items-start">
				{links.linkedin && <LinkedInLink url={links.linkedin} />}
				{links.github && <GithubLink url={links.github} />}
				{links.personalEmail && <EmailLink url={links.personalEmail} />}
				{!hasLinks && (
					<span className="text-sm text-white/60">
						No social links yet. :'(
					</span>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-2 items-start">
				{hasLinks ? (
					<>
						{links.linkedin && <LinkedInLink url={links.linkedin} />}
						{links.github && <GithubLink url={links.github} />}
						{links.personalEmail && <EmailLink url={links.personalEmail} />}
					</>
				) : (
					<span className="text-sm text-white/60">
						No social links yet. Add one below.
					</span>
				)}

				{editable && !isEditing && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="border-white/20 bg-white/10 text-sm text-white hover:bg-white/15 place-self-center w-full"
						onClick={() => setIsEditing(true)}
					>
						{hasLinks ? "Edit Links" : "Add Links"}
					</Button>
				)}
			</div>

			{editable && isEditing && (
				<EditSocials
					links={links}
					onCancel={handleCancel}
					onSuccess={handleSuccess}
				/>
			)}
		</div>
	);
}
