import { AcademicInfo } from "../Profile/AcademicInfo";
import { InternshipList } from "../Profile/Internship/InternshipList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResearchList } from "../Profile/Research/ResearchList";
import { RoleInfo } from "./RoleInfo";
import { Link, useSearch } from "@tanstack/react-router";

type Props = {
	officerId: string;
	archived?: boolean;
};

export function DirectoryProfileTabs({ officerId, archived = false }: Props) {
	const { tab } = useSearch({ from: "/_authed/directory/$userId" });

	return (
		<Tabs defaultValue={tab} className="w-full">
			<TabsList className="w-full justify-start bg-black/40">
				<TabsTrigger
					value="background"
					className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
					asChild
				>
					<Link
						to="/directory/$userId"
						search={{ tab: "background", archived }}
						params={{ userId: officerId }}
					>
						Background
					</Link>
				</TabsTrigger>
				<TabsTrigger
					value="roles"
					className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
					asChild
				>
					<Link
						to="/directory/$userId"
						search={{ tab: "roles", archived }}
						params={{ userId: officerId }}
					>
						Roles
					</Link>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="background" className="mt-6 flex flex-col gap-y-6">
				<InternshipList officerId={officerId} archived={archived} />
				<ResearchList officerId={officerId} archived={archived} />
				<AcademicInfo officerId={officerId} archived={archived} />
			</TabsContent>
			<TabsContent value="roles" className="mt-6">
				<RoleInfo officerId={officerId} archived={archived} />
			</TabsContent>
		</Tabs>
	);
}
