import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CARDS } from "@/lib/dashboard";
import DashboardCard from "@/components/ui/dashboard-card"
import {getOfficerQuery} from "@/queries/officer";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../Spinner";
import AstraLoginCredentials from "@/components/ui/astra-login"
import AstraDetails from "@/components/ui/astra-details"
import { isAdmin } from "@/lib/admin";
import { AdminOfficerOnboarding } from "./AdminOfficerOnboarding";



export function DashboardPlaceholder() {




	const { data: officer, isLoading} = useQuery(getOfficerQuery);

	if (isLoading) {
			return <Spinner />;
		}

	if (!officer) {
			return null;
		}

	const cardsShown = DASHBOARD_CARDS.filter(card => card.minLevel <= officer.accessLevel);
	const userIsAdmin = isAdmin(officer);

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader>
				<CardTitle className="text-3xl font-semibold text-white pl-2">
					ACM Resources
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
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

			{officer.accessLevel > 1 && (
				<>
				<CardHeader>
					<CardTitle className="text-3xl font-semibold text-white pl-2 pt-6">
						Astra Information
					</CardTitle>
					<CardDescription className="text-l text-white/60 pl-2">
						Below is all the needed information for room reservations! Please reach out to the executive team for any questions!
					</CardDescription>
				</CardHeader>

				<div className="flex flex-col min-[769px]:flex-row">
					<AstraLoginCredentials/>
					<AstraDetails/>
				</div>
				</>
			)}

			{userIsAdmin && (
				<div className="p-4 pt-0">
					<AdminOfficerOnboarding />
				</div>
			)}



		</Card>
	);
}
