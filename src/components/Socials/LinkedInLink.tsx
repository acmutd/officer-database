import { Button } from "../ui/button";
import { Linkedin } from "lucide-react";

export function LinkedInLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="max-w-full cursor-pointer justify-start text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 underline"
			asChild
		>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 overflow-hidden"
			>
				<Linkedin className="h-5 w-5 shrink-0" />
				<span className="text-sm truncate">{url.replace("https://", "")}</span>
			</a>
		</Button>
	);
}
