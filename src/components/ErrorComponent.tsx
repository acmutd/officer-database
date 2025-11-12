import type { ErrorComponentProps } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Props = ErrorComponentProps;

export function ACMErrorComponent({ error, reset }: Props) {
	return (
		<div className="flex items-center justify-center p-4">
			<Card className="w-full max-w-lg border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20">
						<AlertTriangle className="h-8 w-8 text-destructive" />
					</div>
					<CardTitle className="text-2xl text-white">
						Something went wrong
					</CardTitle>
					<CardDescription className="text-white/60 text-base mt-2">
						We encountered an error while loading this page.
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="rounded-lg bg-black/30 border border-white/5 p-4">
						<p className="text-sm font-mono text-white/80 break-words">
							{error.message}
						</p>
					</div>

					<div className="flex items-start gap-3 rounded-lg bg-white/5 border border-white/10 p-4">
						<div>
							<p className="text-sm text-white/90 font-medium">Need help?</p>
							<p className="text-sm text-white/60 mt-1">
								Contact an ACM Development Officer if this issue persists.
							</p>
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex justify-center">
					<Button
						onClick={reset}
						variant="outline"
						className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white"
					>
						<RefreshCw className="h-4 w-4" />
						Try Again
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
