import { Button } from "../ui/button";
import { Github } from "lucide-react";

export function GithubLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="cursor-pointer text-zinc-400 hover:bg-zinc-400/10 hover:text-zinc-300"
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
