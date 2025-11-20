import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { InternshipList } from "./Internship/InternshipList";
import { ResearchList } from "./Research/ResearchList";
import { AcademicInfo } from "./AcademicInfo";
import { Link, useSearch } from "@tanstack/react-router";

export function ProfileTabs() {
	const { tab } = useSearch({ from: "/_authed/profile" });
	return (
		<Tabs defaultValue={tab} className="w-full">
			<TabsList className="w-full justify-start bg-white/5">
				<TabsTrigger
					value="professional"
					className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
					asChild
				>
					<Link to="/profile" search={{ tab: "professional" }} replace>
						Professional
					</Link>
				</TabsTrigger>
				<TabsTrigger
					value="academics"
					className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
					asChild
				>
					<Link to="/profile" search={{ tab: "academics" }} replace>
						Academic
					</Link>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="professional" className="mt-6 flex flex-col gap-y-6">
				<InternshipList editable />
				<ResearchList editable />
			</TabsContent>
			<TabsContent value="academics" className="mt-6">
				<AcademicInfo editable />
			</TabsContent>
		</Tabs>
	);
}
