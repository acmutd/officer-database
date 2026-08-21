import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { RoleList } from "./RoleList";
import { ExternalLinks } from "../Socials/ExternalLinks";
import { ImageUpdate } from "./ImageUpdate";
import { UserAvatar } from "./UserAvatar";
import { UpdateName } from "./UpdateName";
import { AcademicInfo } from "./AcademicInfo";
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
import {
	ArchiveRestore,
	CalendarDays,
	CheckCircle2,
	EllipsisVertical,
	GraduationCap,
	Loader2,
} from "lucide-react";
import type { UpdateAcademicsHandle } from "./UpdateAcademics";

type Props = {
	officerId?: string;
	archived?: boolean;
	editable?: boolean;
};

export function ProfileView({ officerId, archived = false, editable = false }: Props) {
	const { data: officer, isLoading } = useQuery(
		officerId ? getOfficerByIdQuery(officerId, archived) : getOfficerQuery
	);
	const [isEditing, setIsEditing] = useState(false);
	const [isAcademicDirty, setIsAcademicDirty] = useState(false);
	const academicFormRef = useRef<UpdateAcademicsHandle>(null);

	const { data: viewer } = useQuery(getOfficerQuery);
	const isViewerExecutive = viewer ? isExecutive(viewer) : false;

	const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation(updateOfficerStatusMutation);
	const { mutate: archive, isPending: isArchiving } = useMutation(archiveOfficerMutation);
	const { mutate: unarchive, isPending: isUnarchiving } = useMutation(unarchiveOfficerMutation);

	if (isLoading) {
		return <Spinner />;
	}

	if (!officer) {
		return null;
	}
	return (
		<div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
			<div className="flex flex-col gap-6">
				<div className="flex w-full items-start justify-between gap-4 px-1 pt-2">
					<div className="z-10 -ml-6 mb-2 -mt-4">
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
									align="start"
									className="w-56 border-white/10 bg-black/90 text-white shadow-2xl backdrop-blur"
								>
									<div className="flex flex-col gap-2">
										<p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
											Admin Actions
										</p>
										<Button
											variant="ghost"
											size="sm"
											className="h-auto w-full justify-start rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-xs text-white hover:bg-white/10 hover:text-white"
											disabled={isUpdatingStatus}
											onClick={() =>
												updateStatus({
													officerId: officer.id,
													isActive: !officer.isActive,
													isArchived: officer.isArchived,
												})
											}
										>
											{isUpdatingStatus && (
												<Loader2 className="mr-2 h-3 w-3 animate-spin" />
											)}
											{!isUpdatingStatus && (
												<CheckCircle2 className="mr-2 h-3.5 w-3.5" />
											)}
										<div className="flex flex-col items-start gap-0.5">
											<span>{officer.isActive ? "Deactivate" : "Activate"}</span>
										</div>
										</Button>

										<Button
											variant="ghost"
											size="sm"
											className="h-auto w-full justify-start rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-3 text-left text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
											disabled={isArchiving || isUnarchiving}
											onClick={() =>
											officer.isArchived
												? unarchive(officer.id)
												: archive(officer.id)
											}
										>
											{(isArchiving || isUnarchiving) && (
												<Loader2 className="mr-2 h-3 w-3 animate-spin" />
											)}
											{!(isArchiving || isUnarchiving) && (
												<ArchiveRestore className="mr-2 h-3.5 w-3.5" />
											)}
											<div className="flex flex-col items-start gap-0.5">
												<span>{officer.isArchived ? "Unarchive" : "Archive"}</span>
											</div>
										</Button>
									</div>
								</PopoverContent>
							</Popover>
						)}
					</div>

					<div className="flex items-center gap-2">
						<div className="z-10 -mr-6 mb-2 -mt-4">
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
						</div>
					</div>
				</div>

				<div className="relative -mt-6 flex flex-col items-center justify-center gap-4 text-center">
					{editable ? (
						<ImageUpdate
							officerId={officer.id}
							firstName={officer.firstName}
							lastName={officer.lastName}
							photo={officer.photo}
							editable={isEditing}
						/>
					) : (
						<UserAvatar
							photo={officer.photo}
							firstName={officer.firstName}
							lastName={officer.lastName}
							className="shadow-2xl"
						/>
					)}

					{editable ? (
						<UpdateName
							officerId={officer.id}
							firstName={officer.firstName}
							lastName={officer.lastName}
							editable={isEditing}
						/>
					) : (
						<h1 className="text-2xl font-semibold tracking-tight text-white">
							{officer.firstName} {officer.lastName}
						</h1>
					)}

					<div className="flex flex-wrap justify-center gap-2 text-sm text-white/70 mt-1">
						<RoleList roles={officer.roles} showAll />
					</div>
				</div>

				<Separator className="mt-2 bg-white/10" />

				{isEditing ? (
					<div className="flex flex-col gap-6 pt-2">
						<AcademicInfo
							officerId={officer.id}
							archived={archived}
							editable={editable}
							variant="inline"
							hideSubmitButton
							academicFormRef={academicFormRef}
							onDirtyChange={setIsAcademicDirty}
						/>

						<Separator className="bg-white/10" />

						<div className="flex flex-col gap-4">
							<span className="text-xs font-semibold uppercase text-white/60">
								Socials
							</span>
							<ExternalLinks
								officerId={officer.id}
								links={officer.socialLinks}
								editable={editable}
								onEditRequest={() => setIsEditing(true)}
								isEditing
								onCancelEdit={() => {
									setIsEditing(false);
									setIsAcademicDirty(false);
								}}
								onFinishEdit={() => {
									setIsEditing(false);
									setIsAcademicDirty(false);
								}}
								onBeforeSave={() =>
									isAcademicDirty ? academicFormRef.current?.submit() : undefined
								}
								extraDirty={isAcademicDirty}
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-4 pl-3 text-sm text-white/80">
							<div className="flex items-start gap-2">
								<GraduationCap className="mt-0.5 h-4 w-4 text-white/55" />
								<div className="space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
										Year Standing
									</div>
									<span>{officer.yearStanding}</span>
								</div>
							</div>
							<div className="flex items-start gap-2">
								<CalendarDays className="mt-0.5 h-4 w-4 text-white/55" />
								<div className="space-y-1">
									<div className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
										Expected Graduation
									</div>
									<span>
										{officer.expectedGrad.term} {officer.expectedGrad.year}
									</span>
								</div>
							</div>
						</div>

						<div className="h-px bg-white/10" />

						<ExternalLinks
							officerId={officer.id}
							links={officer.socialLinks}
							editable={editable}
							compact
							onEditRequest={() => setIsEditing(true)}
							onCancelEdit={() => setIsEditing(false)}
							onFinishEdit={() => setIsEditing(false)}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
