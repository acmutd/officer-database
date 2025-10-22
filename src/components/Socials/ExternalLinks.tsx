import type { SocialLinks } from "@/schemas/officer";
import { LinkedInLink } from "./LinkedInLink";
import { GithubLink } from "./GithubLink";
import { EmailLink } from "./EmailLink";

export function ExternalLinks({ links }: { links: SocialLinks }) {
	return (
		<div className="flex items-center gap-2">
			{links.linkedin && <LinkedInLink url={links.linkedin} />}
			{links.github && <GithubLink url={links.github} />}
			{links.personalEmail && <EmailLink url={links.personalEmail} />}
		</div>
	);
}
