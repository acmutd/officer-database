import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPlaceholder() {
	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Dashboard
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<p className="text-white/70">Dashboard content coming soon...</p>
			</CardContent>
		</Card>
	);
}
