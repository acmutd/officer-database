import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { DialogHeader } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { addInternshipMutationOptions } from "@/queries/officer/internships";

type InternshipFormData = {
	title: string;
	company: string;
	startDate: string;
	endDate?: string;
};

export function AddInternship() {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<InternshipFormData>({
		title: "",
		company: "",
		startDate: "",
	});

	const { mutateAsync: addInternship } = useMutation(
		addInternshipMutationOptions
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await addInternship({ internship: formData });
		setIsOpen(false);
		setFormData({ title: "", company: "", startDate: "" });
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
					<DialogTitle className="text-white">Add New Internship</DialogTitle>
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
					<Button
						type="submit"
						className="w-full bg-white/10 text-white hover:bg-white/20"
					>
						Add Internship
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
