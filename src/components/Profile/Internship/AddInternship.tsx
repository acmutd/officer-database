import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { DialogHeader } from "../../ui/dialog";
import { Input } from "../../ui/input";
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
import { addInternshipMutationOptions } from "@/queries/officer/internships";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InternshipsSchema } from "@/schemas/officer";
import { z } from "zod";
import { toast } from "sonner";

type InternshipFormData = z.infer<typeof InternshipsSchema>;

export function AddInternship() {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
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
		addInternshipMutationOptions
	);

	const onSubmit = async (data: InternshipFormData) => {
		try {
			await addInternship({ internship: data });
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

					<Button
						type="submit"
						disabled={isPending}
						className="w-full bg-white/10 text-white hover:bg-white/20"
					>
						{isPending ? "Adding..." : "Add Internship"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
