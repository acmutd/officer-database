import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateInternshipMutationOptions } from "@/queries/officer/internships";
import { Internships } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
	internship: Internships;
	index: number;
};

export function EditInternshipModal({ internship, index }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Internships>({
		title: internship.title,
		company: internship.company,
		startDate: internship.startDate,
		endDate: internship.endDate,
	});

	const { mutateAsync: updateInternship } = useMutation(
		updateInternshipMutationOptions
	);

	const handleEdit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsEditing(true);
		try {
			await updateInternship({ internship: formData, index });
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to update internship:", error);
		} finally {
			setIsEditing(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 rounded-full p-0 text-white/50 hover:bg-blue-500/10 hover:text-blue-400"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
					>
						<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
						<path d="m15 5 4 4" />
					</svg>
				</Button>
			</DialogTrigger>
			<DialogContent className="border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Edit Internship</DialogTitle>
					<DialogDescription className="text-white/50">
						Update your internship details below
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleEdit} className="space-y-4">
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
						<label htmlFor="company" className="text-white/70">
							Company
						</label>
						<Input
							id="company"
							value={formData.company}
							onChange={(e) =>
								setFormData({
									...formData,
									company: e.target.value,
								})
							}
							required
							className="border-white/10 bg-white/5 text-white"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="startDate" className="text-white/70">
							Start Date
						</label>
						<Input
							id="startDate"
							type="date"
							value={formData.startDate}
							onChange={(e) =>
								setFormData({
									...formData,
									startDate: e.target.value,
								})
							}
							required
							className="border-white/10 bg-white/5 text-white"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="endDate" className="text-white/70">
							End Date (Optional)
						</label>
						<Input
							id="endDate"
							type="date"
							value={formData.endDate}
							onChange={(e) =>
								setFormData({
									...formData,
									endDate: e.target.value,
								})
							}
							className="border-white/10 bg-white/5 text-white"
						/>
					</div>
					<DialogFooter>
						<Button
							variant="ghost"
							type="button"
							onClick={() => setIsOpen(false)}
							className="text-white hover:bg-white/10"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isEditing}
							className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
						>
							{isEditing ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
