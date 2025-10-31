import { Button } from "../ui/button";
import { Github } from "lucide-react";

export function GithubLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="cursor-pointer text-white/70 hover:bg-white/10 hover:text-white"
			asChild
		>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2"
			>
				<Github className="h-5 w-5" />
				<span className="text-sm">{url.replace("https://", "")}</span>
			</a>
		</Button>
	);
}
