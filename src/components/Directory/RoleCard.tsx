import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { isAdmin } from "@/lib/admin";
import { type Role, RoleSchema, divisions } from "@/schemas/officer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOfficerQuery } from "@/queries/officer";
import { updateOfficerRoleMutation, removeOfficerRoleMutation } from "@/queries/roles";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type RoleCardProps = {
	role: Role;
	officerId: string;
	index: number;
};

type RoleFormData = z.infer<typeof RoleSchema>;

export function RoleCard({ role, officerId, index }: RoleCardProps) {
	const { data: currentUser } = useQuery(getOfficerQuery);

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const canEdit = currentUser && isAdmin(currentUser);

	const {
		register,
		formState: { errors },
		control,
		reset,
		watch,
	} = useForm<RoleFormData>({
		resolver: zodResolver(RoleSchema),
		defaultValues: role,
	});

	const currentLevel = watch("level");
	const currentEndDate = watch("endDate");

	const { mutateAsync: updateRoles, isPending } = useMutation(
		updateOfficerRoleMutation(officerId)
	);

	const { mutateAsync: removeRole, isPending: isRemoving } = useMutation(
		removeOfficerRoleMutation(officerId)
	);

	const handleCancel = () => {
		reset(role);
		setIsEditing(false);
	};

	const onSubmit = async (data: RoleFormData) => {
		try {
			await updateRoles({
				role: data,
				index,
				officerId,
			});
			setIsEditing(false);
			toast.success("Role updated successfully");
		} catch (error) {
			toast.error("Failed to update role");
		}
	};

	const handleDeleteRole = async () => {
		try {
			console.log("Attempting to remove role:", { officerId, index, roleTitle: role.title });
			await removeRole({
				officerId,
				roleTitle: role.title,
			});
			setIsDeleteDialogOpen(false);
			toast.success("Role removed successfully");
		} catch (error) {
			console.error("Failed to remove role:", error);
			toast.error("Failed to remove role");
		}
	};

	return (
		<>
			<div className="group relative space-y-4 rounded-lg border border-white/10 bg-white/5 p-6 transition-all">
				{canEdit && !isEditing && (
					<div className="absolute top-4 right-4 space-x-2">
						<Button
							onClick={() => setIsEditing(true)}
							variant="secondary"
							size="sm"
							className="bg-white/10 text-white hover:bg-white/20"
						>
							Edit
						</Button>
					</div>
				)}

			{canEdit && isEditing && (
				<div className="absolute top-4 right-4 space-x-2">
					<Button
						onClick={() => setIsDeleteDialogOpen(true)}
						variant="destructive"
						size="sm"
						className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
					>
						<Trash2 className="h-4 w-4 mr-1" />
						Remove
					</Button>
				</div>
			)}

			<div className="absolute top-4 left-4">
				<span
					className={`rounded-full px-3 py-1 text-xs font-medium ${
						currentLevel === 1
							? "bg-blue-500/20 text-blue-200"
							: currentLevel === 2
								? "bg-purple-500/20 text-purple-200"
								: "bg-yellow-500/20 text-yellow-200"
					}`}
				>
					{currentLevel === 1
						? "Officer"
						: currentLevel === 2
							? "Director"
							: "Executive"}
				</span>
			</div>

				<div className="mt-8 mb-6 border-b border-white/10 pb-4">
					<h3 className="text-lg font-semibold text-white/90">{role.title}</h3>
					<p className="mt-1 text-sm text-white/70">{role.division}</p>
				</div>

				{isEditing ? (
					<>
						<div className="mb-6 grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
							<Field>
								<FieldContent>
									<FieldLabel className="text-white/70">Title</FieldLabel>
									<Input
										{...register("title")}
										className="border-white/20 bg-white/10 text-white/90"
									/>
									<FieldError errors={[errors.title]} />
								</FieldContent>
							</Field>

							<Field>
								<FieldContent>
									<FieldLabel className="text-white/70">Division</FieldLabel>
									<Controller
										name="division"
										control={control}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className="border-white/20 bg-white/10 text-white/90">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="border-white/20 bg-black/30 backdrop-blur-xl">
													{divisions.map((division) => (
														<SelectItem
															key={division}
															value={division}
															className="text-white/90"
														>
															{division}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									<FieldError errors={[errors.division]} />
								</FieldContent>
							</Field>
						</div>

						<div className="mb-6">
							<Field>
								<FieldContent>
									<FieldLabel className="text-white/70">Level</FieldLabel>
									<Controller
										name="level"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value.toString()}
												onValueChange={(value) => field.onChange(parseInt(value))}
											>
												<SelectTrigger className="mt-2 w-full border-white/20 bg-white/10 text-white/90">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="border-white/20 bg-black/30 backdrop-blur-xl">
													<SelectItem value="1" className="text-white/90">
														Officer
													</SelectItem>
													<SelectItem value="2" className="text-white/90">
														Director
													</SelectItem>
													<SelectItem value="3" className="text-white/90">
														Executive
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
									<FieldError errors={[errors.level]} />
								</FieldContent>
							</Field>
						</div>
					</>
				) : null}

				<div className="mt-2 grid grid-cols-2 gap-6">
					<div>
						<FieldLabel className="text-sm font-normal text-white/50">
							Start Date
						</FieldLabel>
						{isEditing ? (
							<div className="mt-2 space-y-2">
								<div className="flex space-x-2">
									<Controller
										name="startDate.term"
										control={control}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className="border-white/20 bg-white/10 text-white/90">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="border-white/20 bg-black/30 backdrop-blur-xl">
													<SelectItem value="Fall" className="text-white/90">
														Fall
													</SelectItem>
													<SelectItem value="Spring" className="text-white/90">
														Spring
													</SelectItem>
													<SelectItem value="Summer" className="text-white/90">
														Summer
													</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
									<Input
										type="number"
										min={2020}
										{...register("startDate.year", { valueAsNumber: true })}
										className="border-white/20 bg-white/10 text-white/90"
									/>
								</div>
								<FieldError
									errors={[errors.startDate?.term, errors.startDate?.year]}
								/>
							</div>
						) : (
							<p className="mt-1 text-base font-medium text-white/90">
								{role.startDate.term} {role.startDate.year}
							</p>
						)}
					</div>
					<div>
						<FieldLabel className="text-sm font-normal text-white/50">
							End Date
						</FieldLabel>
						{isEditing ? (
							currentEndDate === null ? (
								<Controller
									name="endDate"
									control={control}
									render={({ field }) => (
										<Button
											type="button"
											variant="secondary"
											className="mt-2 bg-white/10 text-white hover:bg-white/20"
											onClick={() =>
												field.onChange({
													term: "Fall",
													year: new Date().getFullYear(),
												})
											}
										>
											Set End Date
										</Button>
									)}
								/>
							) : (
								<div className="mt-2 space-y-2">
									<div className="flex space-x-2">
										<Controller
											name="endDate.term"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value || "Fall"}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="border-white/20 bg-white/10 text-white/90">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="border-white/20 bg-black/30 backdrop-blur-xl">
														<SelectItem value="Fall" className="text-white/90">
															Fall
														</SelectItem>
														<SelectItem value="Spring" className="text-white/90">
															Spring
														</SelectItem>
														<SelectItem value="Summer" className="text-white/90">
															Summer
														</SelectItem>
													</SelectContent>
												</Select>
											)}
										/>
										<Controller
											name="endDate.year"
											control={control}
											render={({ field }) => (
												<Input
													type="number"
													min={2020}
													value={field.value || ""}
													onChange={(e) =>
														field.onChange(parseInt(e.target.value))
													}
													className="border-white/20 bg-white/10 text-white/90"
												/>
											)}
										/>
										<Controller
											name="endDate"
											control={control}
											render={({ field }) => (
												<Button
													type="button"
													variant="destructive"
													className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
													onClick={() => field.onChange(null)}
												>
													Clear
												</Button>
											)}
										/>
									</div>
									<FieldError
										errors={[errors.endDate?.term, errors.endDate?.year]}
									/>
								</div>
							)
						) : (
							<p className="mt-1 text-base font-medium text-white/90">
								{currentEndDate
									? `${currentEndDate.term} ${currentEndDate.year}`
									: "Current"}
							</p>
						)}
					</div>
				</div>

				{isEditing && (
					<div className="absolute bottom-4 right-4 space-x-2 flex justify-end">
						<Button
							onClick={() => onSubmit(watch())}
							disabled={isPending}
							variant="default"
							size="sm"
							className="bg-green-500/20 text-green-200 hover:bg-green-500/30"
						>
							{isPending ? "Saving..." : "Save"}
						</Button>
						<Button
							onClick={handleCancel}
							variant="secondary"
							size="sm"
							className="bg-white/10 text-white hover:bg-white/20"
						>
							Cancel
						</Button>
					</div>
				)}

			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="border-white/10 bg-black/40 backdrop-blur-xl max-w-sm">
					<DialogHeader>
						<DialogTitle className="text-white">Remove Role</DialogTitle>
						<DialogDescription className="text-white/50">
							Are you sure you want to remove the <span className="font-semibold text-white">{role.title}</span> role? This is a destructive action.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setIsDeleteDialogOpen(false)}
							className="text-white hover:bg-white/10"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteRole}
							disabled={isRemoving}
							className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
						>
							{isRemoving ? "Removing..." : "Remove Role"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
		</>
	);
}
