import { AcademicInfo } from "../Profile/AcademicInfo";
import { InternshipList } from "../Profile/Internship/InternshipList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResearchList } from "../Profile/Research/ResearchList";
import { RoleInfo } from "./RoleInfo";
import { Link, useSearch } from "@tanstack/react-router";

type Props = {
	officerId: string;
};

export function DirectoryProfileTabs({ officerId }: Props) {
	const { tab } = useSearch({ from: "/_authed/directory/$userId" });

	return (
		<div className="p-10">
			<Tabs defaultValue={tab} className="w-full">
				<TabsList className="w-full justify-start bg-white/5">
					<TabsTrigger
						value="professional"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link
							to="/directory/$userId"
							search={{ tab: "professional" }}
							params={{ userId: officerId }}
						>
							Professional
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="academics"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link
							to="/directory/$userId"
							search={{ tab: "academics" }}
							params={{ userId: officerId }}
						>
							Academic
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="roles"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link
							to="/directory/$userId"
							search={{ tab: "roles" }}
							params={{ userId: officerId }}
						>
							Roles
						</Link>
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value="professional"
					className="mt-6 flex flex-col gap-y-6"
				>
					<InternshipList officerId={officerId} />
					<ResearchList officerId={officerId} />
				</TabsContent>
				<TabsContent value="academics" className="mt-6">
					<AcademicInfo officerId={officerId} />
				</TabsContent>
				<TabsContent value="roles" className="mt-6">
					<RoleInfo officerId={officerId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
