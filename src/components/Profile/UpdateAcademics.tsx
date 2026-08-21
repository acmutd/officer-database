import { type Officer, StandingSchema, TermSchema } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { updateAcademicInfoMutationOptions } from "@/queries/officer";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "../ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { CalendarDays, GraduationCap } from "lucide-react";

const UpdateAcademicsSchema = z.object({
	yearStanding: StandingSchema,
	expectedGrad: TermSchema,
});

type UpdateAcademicsFormData = z.infer<typeof UpdateAcademicsSchema>;

export type UpdateAcademicsHandle = {
	submit: () => Promise<void>;
};

type Props = {
	officer: Officer;
	showSubmitButton?: boolean;
	onDirtyChange?: (dirty: boolean) => void;
};

const UpdateAcademics = forwardRef<UpdateAcademicsHandle, Props>(function UpdateAcademics(
	{ officer, showSubmitButton = true, onDirtyChange },
	ref
) {
	const currentYear = new Date().getFullYear();
	const startYear = 2020; // matches TermSchema minimum
	const years = Array.from({ length: currentYear + 6 - startYear + 1 }, (_, i) => startYear + i);
	const initialValues = {
		yearStanding: officer.yearStanding,
		expectedGrad: officer.expectedGrad,
	};

	const {
		handleSubmit,
		formState: { errors, isDirty },
		control,
		reset,
	} = useForm<UpdateAcademicsFormData>({
		resolver: zodResolver(UpdateAcademicsSchema),
		defaultValues: initialValues,
	});

	const { mutateAsync: updateAcademicInfo, isPending } = useMutation(
		updateAcademicInfoMutationOptions
	);

	useEffect(() => {
		reset(initialValues);
	}, [
		officer.yearStanding,
		officer.expectedGrad.term,
		officer.expectedGrad.year,
		reset,
	]);

	useEffect(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);

	const onSubmit = async (data: UpdateAcademicsFormData) => {
		try {
			await updateAcademicInfo({
				officerId: officer.id,
				netId: officer.netId,
				creditStanding: officer.creditStanding,
				...data,
			});
			reset(data);
			toast.success("Academic info updated successfully");
		} catch (error) {
			toast.error("Failed to update academic info");
			throw error;
		}
	};

	useImperativeHandle(ref, () => ({
		submit: async () => {
			await handleSubmit(onSubmit)();
		},
	}));
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<FieldGroup>
				<div className="space-y-4">
					<Field>
						<FieldContent>
							<FieldLabel htmlFor="yearStanding" className="text-white/70">
								<span className="inline-flex items-center gap-1.5 mt-2">
									<GraduationCap className="h-3.5 w-3.5" />
									Standing (by year)
								</span>
							</FieldLabel>
							<Controller
								name="yearStanding"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
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
								)}
							/>
							<FieldError errors={[errors.yearStanding]} />
						</FieldContent>
					</Field>

					<Field>
						<FieldContent>
							<FieldLabel className="text-white/70">
								<span className="inline-flex items-center gap-1.5">
									<CalendarDays className="h-3.5 w-3.5" />
									Expected Graduation
								</span>
							</FieldLabel>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<Controller
										name="expectedGrad.term"
										control={control}
										render={({ field }) => (
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className="border-white/10 bg-white/5 text-white">
													<SelectValue placeholder="Select term" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Fall">Fall</SelectItem>
													<SelectItem value="Spring">Spring</SelectItem>
													<SelectItem value="Summer">Summer</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
								</div>
								<div>
									<Controller
										name="expectedGrad.year"
										control={control}
										render={({ field }) => (
											<Select
												value={field.value.toString()}
												onValueChange={(value) => field.onChange(parseInt(value))}
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
										)}
									/>
								</div>
							</div>
							<FieldError
								errors={[errors.expectedGrad?.term, errors.expectedGrad?.year]}
							/>
						</FieldContent>
					</Field>
				</div>
			</FieldGroup>

			{showSubmitButton && (
				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={isPending || !isDirty}
						className="bg-acm-gradient"
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			)}
		</form>
	);
});

export default UpdateAcademics;
