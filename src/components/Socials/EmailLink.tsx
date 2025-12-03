import { Button } from "../ui/button";
import { Mail } from "lucide-react";

export function EmailLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="cursor-pointer text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 underline"
			asChild
		>
			<a href={`mailto:${url}`} className="flex items-center gap-2">
				<Mail className="h-5 w-5" />
				<span className="text-sm">{url}</span>
			</a>
		</Button>
	);
}
