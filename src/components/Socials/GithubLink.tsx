import { Button } from "../ui/button";
import { Github } from "lucide-react";

export function GithubLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="max-w-full cursor-pointer justify-start text-white/70 hover:bg-white/10 hover:text-white underline"
			asChild
		>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 overflow-hidden"
			>
				<Github className="h-5 w-5 shrink-0" />
				<span className="text-sm truncate">{url.replace("https://", "")}</span>
			</a>
		</Button>
	);
}
