"use client";
import { AcademicInfo } from "../Profile/AcademicInfo";
import { InternshipList } from "../Profile/Internship/InternshipList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ResearchList } from "../Profile/Research/ResearchList";
import { RoleInfo } from "./RoleInfo";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
	officerId: string;
};

export function DirectoryProfileTabs({ officerId }: Props) {
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab") || "professional";

	return (
		<div className="p-10">
			<Tabs defaultValue={tab} className="w-full">
				<TabsList className="w-full justify-start bg-white/5">
					<TabsTrigger
						value="professional"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link href={`/directory/${officerId}?tab=professional`} replace>
							Professional
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="academics"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link href={`/directory/${officerId}?tab=academics`} replace>
							Academic
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="roles"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link href={`/directory/${officerId}?tab=roles`} replace>
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
