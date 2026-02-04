import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CARDS } from "@/lib/dashboard";
import DashboardCard from "@/components/ui/dashboard-card"

export function DashboardPlaceholder() {
	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Dashboard
				</CardTitle>
			</CardHeader>
				<CardContent className="p-6">
			<div className="grid grid-cols-3 gap-4 items-stretch">	
				{DASHBOARD_CARDS.map((card, index) => (
					<DashboardCard 
					key={index}
					title = {card.title}
					description = {card.description}
					link={card.link}
					/>
					))}
			</div>
			</CardContent>
		</Card>
	);
}
