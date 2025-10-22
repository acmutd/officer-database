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
import { addResearchMutationOptions } from "@/queries/officer/research";
import { Research } from "@/schemas/officer";
import { Plus } from "lucide-react";

export function AddResearch() {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<Research>({
		title: "",
		lab: "",
		principalInvestigator: [""],
		startDate: "",
	});

	const { mutateAsync: addResearch } = useMutation(addResearchMutationOptions);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await addResearch({ research: formData });
		setIsOpen(false);
		setFormData({
			title: "",
			lab: "",
			principalInvestigator: [""],
			startDate: "",
		});
	};

	const handlePIChange = (index: number, value: string) => {
		const newPIs = [...formData.principalInvestigator];
		newPIs[index] = value;
		setFormData({ ...formData, principalInvestigator: newPIs });
	};

	const addPI = () => {
		setFormData({
			...formData,
			principalInvestigator: [...formData.principalInvestigator, ""],
		});
	};

	const removePI = (index: number) => {
		const newPIs = formData.principalInvestigator.filter((_, i) => i !== index);
		setFormData({ ...formData, principalInvestigator: newPIs });
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
					<DialogTitle className="text-white">Add New Research</DialogTitle>
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
						<label htmlFor="lab" className="text-white/70">
							Lab
						</label>
						<Input
							id="lab"
							value={formData.lab}
							onChange={(e) =>
								setFormData({
									...formData,
									lab: e.target.value,
								})
							}
							required
							className="border-white/10 bg-white/5 text-white"
						/>
					</div>
					<div className="space-y-2">
						<label className="text-white/70">Principal Investigators</label>
						{formData.principalInvestigator.map((pi, index) => (
							<div key={index} className="flex gap-2">
								<Input
									value={pi}
									onChange={(e) => handlePIChange(index, e.target.value)}
									required
									className="border-white/10 bg-white/5 text-white"
									placeholder="Principal Investigator name"
								/>
								{formData.principalInvestigator.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removePI(index)}
										className="h-10 w-10 text-red-400 hover:bg-red-500/10"
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
											<path d="M18 6 6 18" />
											<path d="m6 6 12 12" />
										</svg>
									</Button>
								)}
							</div>
						))}
						<Button
							type="button"
							variant="ghost"
							onClick={addPI}
							className="mt-2 text-blue-400 hover:bg-blue-500/10"
						>
							Add Principal Investigator
						</Button>
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
						Add Research
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
