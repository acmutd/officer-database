import { Officer } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { updateAcademicInfoMutationOptions } from "@/queries/officer";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function UpdateAcademics({ officer }: { officer: Officer }) {
	const [formData, setFormData] = useState<
		Pick<Officer, "netId" | "creditStanding" | "yearStanding" | "expectedGrad">
	>({
		netId: officer.netId,
		creditStanding: officer.creditStanding,
		yearStanding: officer.yearStanding,
		expectedGrad: officer.expectedGrad,
	});

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
	const { mutate: updateAcademicInfo } = useMutation(
		updateAcademicInfoMutationOptions
	);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateAcademicInfo({ academicInfo: formData });
	};
	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-1.5">
				<Label htmlFor="netId" className="text-sm font-medium text-white/70">
					Net ID
				</Label>
				<Input
					id="netId"
					value={formData.netId}
					onChange={(e) =>
						setFormData({
							...formData,
							netId: e.target.value,
						})
					}
					className="border-white/10 bg-white/5 text-white placeholder:text-white/50"
					placeholder="Enter your Net ID"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label
						htmlFor="yearStanding"
						className="text-sm font-medium text-white/70"
					>
						Standing (by year)
					</Label>
					<Select
						value={formData.yearStanding}
						onValueChange={(value) =>
							setFormData({
								...formData,
								yearStanding: value as Officer["yearStanding"],
							})
						}
					>
						<SelectTrigger className="border-white/10 bg-white/5 text-white">
							<SelectValue placeholder="Select year standing" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Freshman">Freshman</SelectItem>
							<SelectItem value="Sophomore">Sophomore</SelectItem>
							<SelectItem value="Junior">Junior</SelectItem>
							<SelectItem value="Senior">Senior</SelectItem>
							<SelectItem value="Graduate">Graduate</SelectItem>
							<SelectItem value="Alumni">Alumni</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-1.5">
					<Label
						htmlFor="creditStanding"
						className="text-sm font-medium text-white/70"
					>
						Standing (by credit)
					</Label>
					<Select
						value={formData.creditStanding}
						onValueChange={(value) =>
							setFormData({
								...formData,
								creditStanding: value as Officer["creditStanding"],
							})
						}
					>
						<SelectTrigger className="border-white/10 bg-white/5 text-white">
							<SelectValue placeholder="Select credit standing" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Freshman">Freshman</SelectItem>
							<SelectItem value="Sophomore">Sophomore</SelectItem>
							<SelectItem value="Junior">Junior</SelectItem>
							<SelectItem value="Senior">Senior</SelectItem>
							<SelectItem value="Graduate">Graduate</SelectItem>
							<SelectItem value="Alumni">Alumni</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label className="text-sm font-medium text-white/70">
					Expected Graduation
				</Label>
				<div className="flex space-x-2">
					<Select
						value={formData.expectedGrad.term}
						onValueChange={(value) =>
							setFormData({
								...formData,
								expectedGrad: {
									...formData.expectedGrad,
									term: value as typeof formData.expectedGrad.term,
								},
							})
						}
					>
						<SelectTrigger className="border-white/10 bg-white/5 text-white">
							<SelectValue placeholder="Select term" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Fall">Fall</SelectItem>
							<SelectItem value="Spring">Spring</SelectItem>
							<SelectItem value="Summer">Summer</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={formData.expectedGrad.year.toString()}
						onValueChange={(value) =>
							setFormData({
								...formData,
								expectedGrad: {
									...formData.expectedGrad,
									year: parseInt(value),
								},
							})
						}
					>
						<SelectTrigger className="border-white/10 bg-white/5 text-white">
							<SelectValue placeholder="Select year" />
						</SelectTrigger>
						<SelectContent>
							{years.map((year) => (
								<SelectItem key={year} value={year.toString()}>
									{year}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex justify-end">
				<Button type="submit" className="bg-acm-gradient">
					Save Changes
				</Button>
			</div>
		</form>
	);
}
