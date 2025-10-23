"use client";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearchParams } from "next/navigation";
import { ProfileSettings } from "./ProfileSettings";
import { InternshipList } from "./Internship/InternshipList";
import { ResearchList } from "./Research/ResearchList";
import { AcademicInfo } from "./AcademicInfo";

export function ProfileTabs() {
	const searchparams = useSearchParams();
	const tab = searchparams.get("tab") || "personal";
	return (
		<div className="p-10">
			<Tabs defaultValue={tab} className="w-full">
				<TabsList className="w-full justify-start bg-white/5">
					<TabsTrigger
						value="personal"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link href="/profile?tab=personal" replace>
							Personal
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="professional"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link href="/profile?tab=professional" replace>
							Professional
						</Link>
					</TabsTrigger>
					<TabsTrigger
						value="academics"
						className="text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white"
						asChild
					>
						<Link href="/profile?tab=academics" replace>
							Academic
						</Link>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="personal" className="mt-6">
					<ProfileSettings />
				</TabsContent>
				<TabsContent
					value="professional"
					className="mt-6 flex flex-col gap-y-6"
				>
					<InternshipList editable />
					<ResearchList editable />
					{/* <ResumeUpload  /> */}
				</TabsContent>
				<TabsContent value="academics" className="mt-6">
					<AcademicInfo editable />
				</TabsContent>
			</Tabs>
		</div>
	);
}
