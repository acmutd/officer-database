import { Button } from "../ui/button";
import { Mail } from "lucide-react";

export function EmailLink({ url }: { url: string }) {
	return (
		<Button
			variant="ghost"
			className="max-w-full cursor-pointer justify-start text-purple-400 hover:bg-purple-400/10 hover:text-purple-300 underline"
			asChild
		>
			<a
				href={`mailto:${url}`}
				className="flex items-center gap-2 overflow-hidden"
			>
				<Mail className="h-5 w-5 shrink-0" />
				<span className="text-sm truncate">{url}</span>
			</a>
		</Button>
	);
}
