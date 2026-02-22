import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
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
import { Plus } from "lucide-react";
import { addInternshipMutation } from "@/queries/internships";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InternshipsSchema } from "@/schemas/officer";
import { z } from "zod";
import { toast } from "sonner";

type InternshipFormData = z.infer<typeof InternshipsSchema>;

export function AddInternship({ officerId }: { officerId?: string }) {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
		watch,
		setValue,
	} = useForm<InternshipFormData>({
		resolver: zodResolver(InternshipsSchema),
		defaultValues: {
			title: "",
			company: "",
			startDate: "",
			endDate: "",
		},
	});

	const { mutateAsync: addInternship, isPending } = useMutation(
		addInternshipMutation
	);

	const onSubmit = async (data: InternshipFormData) => {
		try {
			await addInternship({ officerId, data });
			setIsOpen(false);
			reset();
			toast.success("Internship added successfully");
		} catch (error) {
			toast.error("Failed to add internship");
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
			<DialogContent className="border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Add New Internship</DialogTitle>
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
									placeholder="Software Engineer Intern"
								/>
								<FieldError errors={[errors.title]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="company" className="text-white/70">
									Company
								</FieldLabel>
								<Input
									id="company"
									{...register("company")}
									className="border-white/10 bg-white/5 text-white"
									placeholder="Company Name"
								/>
								<FieldError errors={[errors.company]} />
							</FieldContent>
						</Field>

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
						{isPending ? "Adding..." : "Add Internship"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
