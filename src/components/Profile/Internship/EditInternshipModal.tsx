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
import { DatePicker } from "@/components/ui/date-picker";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { updateInternshipMutation } from "@/queries/internships";
import { type Internships, InternshipsSchema } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

type Props = {
	officerId?: string;
	internship: Internships;
	index: number;
};

type InternshipFormData = z.infer<typeof InternshipsSchema>;

export function EditInternshipModal({ officerId, internship, index }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
		setValue,
		reset,
	} = useForm<InternshipFormData>({
		resolver: zodResolver(InternshipsSchema),
		defaultValues: {
			title: internship.title,
			company: internship.company,
			startDate: internship.startDate,
			endDate: internship.endDate || "",
		},
	});

	const { mutateAsync: updateInternship, isPending } = useMutation(
		updateInternshipMutation
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		reset({
			title: internship.title,
			company: internship.company,
			startDate: internship.startDate,
			endDate: internship.endDate || "",
		});
	}, [internship.title, internship.company, internship.startDate, internship.endDate, isOpen, reset]);

	const onSubmit = async (data: InternshipFormData) => {
		try {
			await updateInternship({ officerId, index, data });
			reset(data);
			setIsOpen(false);
			toast.success("Internship updated successfully");
		} catch (error) {
			toast.error("Failed to update internship");
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
								<FieldLabel htmlFor="company" className="text-white/70">
									Company
								</FieldLabel>
								<Input
									id="company"
									{...register("company")}
									className="border-white/10 bg-white/5 text-white"
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
							disabled={isPending || !isDirty}
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
