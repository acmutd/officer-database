import { Button } from "../ui/button";
import { Linkedin } from "lucide-react";

export function LinkedInLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="cursor-pointer text-blue-400 hover:bg-blue-400/10 hover:text-blue-300"
			asChild
		>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2"
			>
				<Linkedin className="h-5 w-5" />
				<span className="text-sm">{url.replace("https://", "")}</span>
			</a>
		</Button>
	);
}
