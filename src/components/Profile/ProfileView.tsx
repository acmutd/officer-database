import { cn } from "@/lib/utils";
import { RoleList } from "./RoleList";
import { ExternalLinks } from "../Socials/ExternalLinks";
import { ImageUpdate } from "./ImageUpdate";
import { UserAvatar } from "./UserAvatar";
import { UpdateName } from "./UpdateName";
import {
	getOfficerQuery,
	getOfficerByIdQuery,
	updateOfficerStatusMutation,
	archiveOfficerMutation,
	unarchiveOfficerMutation,
} from "@/queries/officer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner } from "../Spinner";
import { isExecutive } from "@/lib/admin";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";

type Props = {
	officerId?: string;
	editable?: boolean;
};

export function ProfileView({ officerId, editable = false }: Props) {
	const { data: officer, isLoading } = useQuery(
		officerId ? getOfficerByIdQuery(officerId) : getOfficerQuery
	);

	const { data: viewer } = useQuery(getOfficerQuery);
	const isViewerExecutive = viewer ? isExecutive(viewer) : false;

	const { mutate: updateStatus } = useMutation(updateOfficerStatusMutation);
	const { mutate: archive } = useMutation(archiveOfficerMutation);
	const { mutate: unarchive } = useMutation(unarchiveOfficerMutation);

	if (isLoading) {
		return <Spinner />;
	}

	if (!officer) {
		return null;
	}
	return (
		<div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
			<div className="flex flex-col items-center gap-6 text-center">
				<div className="flex w-full items-start justify-between">
					<div className="flex-1" />
					{editable ? (
						<ImageUpdate
							officerId={officer.id}
							firstName={officer.firstName}
							lastName={officer.lastName}
							photo={officer.photo}
						/>
					) : (
						<UserAvatar
							photo={officer.photo}
							firstName={officer.firstName}
							lastName={officer.lastName}
							className="shadow-2xl ring-4 ring-white/30"
						/>
					)}
					<div className="flex flex-1 justify-end">
						{isViewerExecutive && officerId && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="ghost"
										size="icon-sm"
										className="rounded-full border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
										aria-label="More profile actions"
									>
										<EllipsisVertical className="h-4 w-4" />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									className="w-64 border-white/10 bg-black/90 text-white shadow-2xl backdrop-blur"
								>
									<div className="flex flex-col gap-3">
										<div className="text-left">
											<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
												Profile actions
											</p>
											<p className="text-xs text-white/60">
												Adjust visibility and status without removing this profile.
											</p>
										</div>
										<Button
											variant="secondary"
											size="sm"
											className="justify-start rounded-full border border-white/10 px-3 text-xs"
											onClick={() =>
												updateStatus({
													officerId: officer.id,
													isActive: !officer.isActive,
													isArchived: officer.isArchived,
												})
											}
										>
											{officer.isActive ? "Deactivate" : "Activate"} profile
										</Button>
										<Button
											variant={officer.isArchived ? "secondary" : "destructive"}
											size="sm"
											className="justify-start rounded-full border border-white/10 px-3 text-xs"
											onClick={() =>
												officer.isArchived
													? unarchive(officer.id)
													: archive(officer.id)
											}
										>
											{officer.isArchived ? "Unarchive" : "Archive"} profile
										</Button>
									</div>
								</PopoverContent>
							</Popover>
						)}
					</div>
				</div>


				{editable ? (
					<UpdateName
						firstName={officer.firstName}
						lastName={officer.lastName}
					/>

				) : (
					<h1 className="text-2xl font-semibold tracking-tight text-white">
						{officer.firstName} {officer.lastName}
					</h1>
				)}

				<div
					className={cn(
						"flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
						officer.isActive
							? "border-green-500/20 bg-green-500/10 text-green-400"
							: "border-red-500/20 bg-red-500/10 text-red-400"
					)}
				>
					<div
						className={cn(
							"h-1.5 w-1.5 rounded-full shadow-[0_0_8px]",
							officer.isActive
								? "bg-green-400 shadow-green-500/50"
								: "bg-red-400 shadow-red-500/50"
						)}
					/>
					{officer.isActive ? "Active" : "Inactive"}
				</div>


				<div className="flex flex-wrap justify-center gap-2 text-sm text-white/70 -mt-3">
					<RoleList roles={officer.roles} showAll />
				</div>


			</div>

			<Separator className="mt-6 bg-white/10" />

			<div className="flex flex-col gap-4 pt-8">
				<span className="text-xs font-semibold uppercase text-white/60">
					Socials
				</span>
				<ExternalLinks links={officer.socialLinks} editable={editable} />
			</div>
		</div>

	);
}
