import { Button } from "../ui/button";
import { Instagram } from "lucide-react";

export function InstagramLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="cursor-pointer text-pink-400 hover:bg-pink-400/10 hover:text-pink-300 underline"
			asChild
		>
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2"
			>
				<Instagram className="h-5 w-5" />
				<span className="text-sm">{url.replace("https://", "")}</span>
			</a>
		</Button>
	);
}
