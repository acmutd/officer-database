import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Officer, Role } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { divisions } from "@/schemas/officer";
import { addOfficerRoleMutationOptions } from "@/queries/officer/roles";

const defaultRole: Role = {
	title: "",
	division: "",
	level: 1,
	startDate: {
		term: "Fall",
		year: new Date().getFullYear(),
	},
	endDate: null,
};

type Props = {
	officerId: string;
};

export function AddRole({ officerId }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<Role>(defaultRole);

	const { mutateAsync: addRole } = useMutation(
		addOfficerRoleMutationOptions(officerId)
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await addRole({ role: formData, officerId });
		setIsOpen(false);
		setFormData(defaultRole);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
				>
					<Plus className="h-4 w-4 text-white" />
				</Button>
			</DialogTrigger>
			<DialogContent className="border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Add New Role</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="title" className="text-white/70">
							Title
						</label>
						<Input
							id="title"
							value={formData.title}
							onChange={(e) =>
								setFormData({
									...formData,
									title: e.target.value,
								})
							}
							required
							className="border-white/10 bg-white/5 text-white"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="division" className="text-white/70">
							Division
						</label>
						<Select
							value={formData.division}
							onValueChange={(value) =>
								setFormData({
									...formData,
									division: value,
								})
							}
						>
							<SelectTrigger className="border-white/10 bg-white/5 text-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-white/10 bg-zinc-900">
								{divisions.map((division) => (
									<SelectItem
										key={division}
										value={division}
										className="text-white"
									>
										{division}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<label htmlFor="level" className="text-white/70">
							Level
						</label>
						<Select
							value={formData.level.toString()}
							onValueChange={(value) =>
								setFormData({
									...formData,
									level: parseInt(value),
								})
							}
						>
							<SelectTrigger className="border-white/10 bg-white/5 text-white">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="border-white/10 bg-zinc-900">
								<SelectItem value="1" className="text-white">
									Officer
								</SelectItem>
								<SelectItem value="2" className="text-white">
									Director
								</SelectItem>
								<SelectItem value="3" className="text-white">
									Executive
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<label className="text-white/70">Start Date</label>
						<div className="flex space-x-2">
							<Select
								value={formData.startDate.term}
								onValueChange={(value) =>
									setFormData({
										...formData,
										startDate: {
											...formData.startDate,
											term: value as "Fall" | "Spring" | "Summer",
										},
									})
								}
							>
								<SelectTrigger className="border-white/10 bg-white/5 text-white">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="border-white/10 bg-zinc-900">
									<SelectItem value="Fall" className="text-white">
										Fall
									</SelectItem>
									<SelectItem value="Spring" className="text-white">
										Spring
									</SelectItem>
									<SelectItem value="Summer" className="text-white">
										Summer
									</SelectItem>
								</SelectContent>
							</Select>
							<Input
								type="number"
								min={2020}
								value={formData.startDate.year}
								onChange={(e) =>
									setFormData({
										...formData,
										startDate: {
											...formData.startDate,
											year: parseInt(e.target.value),
										},
									})
								}
								required
								className="border-white/10 bg-white/5 text-white"
							/>
						</div>
					</div>
					<Button
						type="submit"
						className="w-full bg-white/10 text-white hover:bg-white/20"
					>
						Add Role
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
