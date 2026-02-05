import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CARDS } from "@/lib/dashboard";
import DashboardCard from "@/components/ui/dashboard-card"
import {getOfficerQuery} from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../Spinner";



export function DashboardPlaceholder() {

	


	const { data: officer, isLoading} = useQuery(getOfficerQuery);

	if (isLoading) {
			return <Spinner />;
		}

	if (!officer) {
			return null;
		}

	const cardsShown = DASHBOARD_CARDS.filter(card => card.minLevel <= officer.accessLevel);

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Dashboard
				</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">	
				{cardsShown.map((card, index) => (
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
