import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { DialogHeader } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { DatePicker } from "../../ui/date-picker";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addResearchMutation } from "@/queries/research";
import { ResearchSchema } from "@/schemas/officer";
import { Plus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Internal form schema with objects for useFieldArray compatibility
const ResearchFormSchema = ResearchSchema.extend({
	principalInvestigator: z.array(z.object({ name: z.string().min(1) })),
});

type ResearchFormData = z.infer<typeof ResearchFormSchema>;

export function AddResearch() {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		control,
		reset,
		watch,
		setValue,
	} = useForm<ResearchFormData>({
		resolver: zodResolver(ResearchFormSchema),
		defaultValues: {
			principalInvestigator: [{ name: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "principalInvestigator",
	});

	const { mutateAsync: addResearch, isPending } =
		useMutation(addResearchMutation);

	const onSubmit = async (data: ResearchFormData) => {
		try {
			// Transform the data to match the schema (string array instead of object array)
			const transformedData = {
				...data,
				principalInvestigator: data.principalInvestigator.map((pi) => pi.name),
			};
			await addResearch(transformedData);
			setIsOpen(false);
			reset();
			toast.success("Research added successfully");
		} catch (error) {
			toast.error("Failed to add research");
		}
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
			<DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Add New Research</DialogTitle>
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
									placeholder="Research project title"
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
									placeholder="Laboratory name"
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
								<DatePicker
									value={watch("startDate")}
									onChange={(date) =>
										setValue("startDate", date, { shouldDirty: true })
									}
									placeholder="Select start date"
									maxDate={new Date()}
								/>
								<FieldError errors={[errors.startDate]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="endDate" className="text-white/70">
									End Date (Optional)
								</FieldLabel>
								<DatePicker
									value={watch("endDate")}
									onChange={(date) =>
										setValue("endDate", date, { shouldDirty: true })
									}
									placeholder="Select end date"
								maxDate={new Date()}
								/>
								<FieldError errors={[errors.endDate]} />
							</FieldContent>
						</Field>
					</FieldGroup>

					<Button
						type="submit"
						disabled={isPending || !isDirty}
						className="w-full bg-white/10 text-white hover:bg-white/20"
					>
						{isPending ? "Adding..." : "Add Research"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}