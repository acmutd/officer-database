import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { InternshipList } from "./Internship/InternshipList";
import { ResearchList } from "./Research/ResearchList";
import { AcademicInfo } from "./AcademicInfo";
import { ResumeSection } from "./ResumeSection";
import { DashboardPlaceholder } from "./Dashboard";
import { Link, useSearch } from "@tanstack/react-router";

export function ProfileTabs() {
	const { tab } = useSearch({ from: "/_authed/profile" });
	return (
		<Tabs defaultValue={tab} className="w-full">
			<TabsList className="w-full justify-start bg-black/40">
				<TabsTrigger
					value="background"
					className="text-white/70 data-[state=active]:bg-white/10  data-[state=active]:text-white"
					asChild
				>
					<Link to="/profile" search={{ tab: "background" }} replace>
						Background
					</Link>
				</TabsTrigger>
				<TabsTrigger
					value="dashboard"
					className="text-white/70 data-[state=active]:bg-white/10  data-[state=active]:text-white"
					asChild
				>
					<Link to="/profile" search={{ tab: "dashboard" }} replace>
						Dashboard
					</Link>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="background" className="mt-6 flex flex-col gap-y-6">
				<AcademicInfo editable />
				<InternshipList editable />
				<ResearchList editable />
				<ResumeSection />
			</TabsContent>
			<TabsContent value="dashboard" className="mt-6">
				<DashboardPlaceholder />
			</TabsContent>
		</Tabs>
	);
}
