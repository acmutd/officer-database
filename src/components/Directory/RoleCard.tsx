import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { isAdmin } from "@/lib/admin";
import { Role, divisions } from "@/schemas/officer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	getCurrentOfficerQueryOptions,
	getOfficerByIdQueryOptions,
} from "@/queries/officer";
import { updateOfficerRolesMutationOptions } from "@/queries/officer/roles";

type RoleCardProps = {
	role: Role;
	officerId: string;
	index: number;
};

export function RoleCard({ role, officerId, index }: RoleCardProps) {
	const { data: currentUser } = useQuery(getCurrentOfficerQueryOptions);

	if (!currentUser) throw new Error("Current user or officer not found");

	const [isEditing, setIsEditing] = useState(false);
	const [editingRole, setEditingRole] = useState(role);
	const canEdit = isAdmin(currentUser);

	const { mutateAsync: updateRoles } = useMutation(
		updateOfficerRolesMutationOptions(officerId)
	);

	const handleSave = async () => {
		await updateRoles({
			role: editingRole,
			index,
			officerId,
		});
		setIsEditing(false);
	};

	const handleUpdate = (field: keyof Role, value: any) => {
		setEditingRole({ ...editingRole, [field]: value });
	};

	return (
		<div className="group relative space-y-4 rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/[0.07]">
			{/* Edit/Save Buttons */}
			{canEdit && (
				<div className="absolute top-4 right-4 space-x-2">
					{isEditing ? (
						<>
							<Button
								onClick={handleSave}
								variant="default"
								size="sm"
								className="bg-green-500/20 text-green-200 hover:bg-green-500/30"
							>
								Save
							</Button>
							<Button
								onClick={() => {
									setEditingRole(role);
									setIsEditing(false);
								}}
								variant="secondary"
								size="sm"
								className="bg-white/10 text-white hover:bg-white/20"
							>
								Cancel
							</Button>
						</>
					) : (
						<Button
							onClick={() => setIsEditing(true)}
							variant="secondary"
							size="sm"
							className="bg-white/10 text-white hover:bg-white/20"
						>
							Edit
						</Button>
					)}
				</div>
			)}

			{/* Role Level Badge */}
			<div className="absolute top-4 left-4">
				<span
					className={`rounded-full px-3 py-1 text-xs font-medium ${
						editingRole.level === 1
							? "bg-blue-500/20 text-blue-200"
							: editingRole.level === 2
							? "bg-purple-500/20 text-purple-200"
							: "bg-yellow-500/20 text-yellow-200"
					}`}
				>
					{editingRole.level === 1
						? "Officer"
						: editingRole.level === 2
						? "Director"
						: "Executive"}
				</span>
			</div>

			{/* Title and Division - More prominent */}
			<div className="mt-8 mb-6 border-b border-white/10 pb-4">
				<h3 className="text-lg font-semibold text-white/90">
					{editingRole.title}
				</h3>
				<p className="mt-1 text-sm text-white/70">{editingRole.division}</p>
			</div>

			{isEditing ? (
				<>
					{/* Edit Mode - Title and Division */}
					<div className="mb-6 grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
						<div className="space-y-2">
							<Label className="text-white/70">Title</Label>
							<Input
								value={editingRole.title}
								onChange={(e) => handleUpdate("title", e.target.value)}
								className="border-white/20 bg-white/10 text-white/90"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-white/70">Division</Label>
							<Select
								value={editingRole.division}
								onValueChange={(value) => handleUpdate("division", value)}
							>
								<SelectTrigger className="border-white/20 bg-white/10 text-white/90">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-white/20 bg-zinc-900">
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
						</div>
					</div>

					{/* Edit Mode - Level */}
					<div className="mb-6">
						<Label className="text-white/70">Level</Label>
						<Select
							value={editingRole.level.toString()}
							onValueChange={(value) => handleUpdate("level", parseInt(value))}
						>
							<SelectTrigger className="mt-2 w-full border-white/20 bg-white/10 text-white/90">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-white/20 bg-zinc-900">
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
					</div>
				</>
			) : null}

			{/* Dates Section */}
			<div className="mt-2 grid grid-cols-2 gap-6">
				<div>
					<Label className="text-sm font-normal text-white/50">
						Start Date
					</Label>
					{isEditing ? (
						<div className="mt-2 flex space-x-2">
							<Select
								value={editingRole.startDate.term}
								onValueChange={(value) =>
									handleUpdate("startDate", {
										...editingRole.startDate,
										term: value,
									})
								}
							>
								<SelectTrigger className="border-white/20 bg-white/10 text-white/90">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-white/20 bg-zinc-900">
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
							<Input
								type="number"
								min={2020}
								value={editingRole.startDate.year}
								onChange={(e) =>
									handleUpdate("startDate", {
										...editingRole.startDate,
										year: parseInt(e.target.value),
									})
								}
								className="border-white/20 bg-white/10 text-white/90"
							/>
						</div>
					) : (
						<p className="mt-1 text-base font-medium text-white/90">
							{editingRole.startDate.term} {editingRole.startDate.year}
						</p>
					)}
				</div>
				<div>
					<Label className="text-sm font-normal text-white/50">End Date</Label>
					{isEditing ? (
						editingRole.endDate === null ? (
							<Button
								variant="secondary"
								className="mt-2 bg-white/10 text-white hover:bg-white/20"
								onClick={() =>
									handleUpdate("endDate", {
										term: "Fall",
										year: new Date().getFullYear(),
									})
								}
							>
								Set End Date
							</Button>
						) : (
							<div className="mt-2 flex space-x-2">
								<Select
									value={editingRole.endDate.term}
									onValueChange={(value) =>
										handleUpdate("endDate", {
											...editingRole.endDate,
											term: value,
										})
									}
								>
									<SelectTrigger className="border-white/20 bg-white/10 text-white/90">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="border-white/20 bg-zinc-900">
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
								<Input
									type="number"
									min={2020}
									value={editingRole.endDate.year}
									onChange={(e) =>
										handleUpdate("endDate", {
											...editingRole.endDate,
											year: parseInt(e.target.value),
										})
									}
									className="border-white/20 bg-white/10 text-white/90"
								/>
								<Button
									variant="destructive"
									className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
									onClick={() => handleUpdate("endDate", null)}
								>
									Clear
								</Button>
							</div>
						)
					) : (
						<p className="mt-1 text-base font-medium text-white/90">
							{editingRole.endDate
								? `${editingRole.endDate.term} ${editingRole.endDate.year}`
								: "Current"}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
