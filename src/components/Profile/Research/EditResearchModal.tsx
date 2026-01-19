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
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { type Research, ResearchSchema } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { updateResearchMutation } from "@/queries/research";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type Props = {
	research: Research;
	index: number;
};

// Internal form schema with objects for useFieldArray compatibility
const ResearchFormSchema = ResearchSchema.extend({
	principalInvestigator: z.array(z.object({ name: z.string().min(1) })),
});

type ResearchFormData = z.infer<typeof ResearchFormSchema>;

export function EditResearchModal({ research, index }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<ResearchFormData>({
		resolver: zodResolver(ResearchFormSchema),
		defaultValues: {
			title: research.title,
			lab: research.lab,
			// Transform string array to object array for form
			principalInvestigator: research.principalInvestigator.map((name) => ({
				name,
			})),
			startDate: research.startDate,
			endDate: research.endDate || "",
		},
	});

	// this is a little annoying but it's the only way to get the field array to work with the form
	const { fields, append, remove } = useFieldArray({
		control,
		name: "principalInvestigator",
	});

	const { mutateAsync: updateResearch, isPending } = useMutation(
		updateResearchMutation
	);

	const onSubmit = async (data: ResearchFormData) => {
		try {
			const transformedData = {
				...data,
				principalInvestigator: data.principalInvestigator.map((pi) => pi.name),
			};
			await updateResearch({ index, data: transformedData });
			setIsOpen(false);
			toast.success("Research updated successfully");
		} catch (error) {
			toast.error("Failed to update research");
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
			<DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Edit Research</DialogTitle>
					<DialogDescription className="text-white/50">
						Update your research details below
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FieldGroup>
						<Field>
							<FieldContent>
								<FieldLabel htmlFor="title" className="text-white/70">
									Title
								</FieldLabel>
								<Input
									id="title"
									{...register("title")}
									className="border-white/10 bg-white/5 text-white"
								/>
								<FieldError errors={[errors.title]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="lab" className="text-white/70">
									Lab
								</FieldLabel>
								<Input
									id="lab"
									{...register("lab")}
									className="border-white/10 bg-white/5 text-white"
								/>
								<FieldError errors={[errors.lab]} />
							</FieldContent>
						</Field>

						<div className="space-y-2">
							<FieldLabel className="text-white/70">
								Principal Investigators
							</FieldLabel>
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2">
									<div className="flex-1">
										<Input
											{...register(
												`principalInvestigator.${index}.name` as const
											)}
											className="border-white/10 bg-white/5 text-white"
											placeholder="Principal Investigator name"
										/>
										<FieldError
											errors={[errors.principalInvestigator?.[index]?.name]}
										/>
									</div>
									{fields.length > 1 && (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => remove(index)}
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
								onClick={() => append({ name: "" })}
								className="mt-2 text-blue-400 hover:bg-blue-500/10"
							>
								Add Principal Investigator
							</Button>
						</div>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="startDate" className="text-white/70">
									Start Date
								</FieldLabel>
								<Input
									id="startDate"
									type="date"
									{...register("startDate")}
									className="border-white/10 bg-white/5 text-white"
								/>
								<FieldError errors={[errors.startDate]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="endDate" className="text-white/70">
									End Date (Optional)
								</FieldLabel>
								<Input
									id="endDate"
									type="date"
									{...register("endDate")}
									className="border-white/10 bg-white/5 text-white"
								/>
								<FieldError errors={[errors.endDate]} />
							</FieldContent>
						</Field>
					</FieldGroup>

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
							disabled={isPending}
							className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
						>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
