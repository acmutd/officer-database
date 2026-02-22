import { type Officer, StandingSchema, TermSchema } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { useEffect } from "react";

const UpdateAcademicsSchema = z.object({
	netId: z.string().min(1, "Net ID is required"),
	creditStanding: StandingSchema,
	yearStanding: StandingSchema,
	expectedGrad: TermSchema,
});

type UpdateAcademicsFormData = z.infer<typeof UpdateAcademicsSchema>;

export default function UpdateAcademics({ officer }: { officer: Officer }) {
	const currentYear = new Date().getFullYear();
	const startYear = 2020; // matches TermSchema minimum
	const years = Array.from({ length: currentYear + 6 - startYear + 1 }, (_, i) => startYear + i);
	const initialValues = {
		netId: officer.netId,
		creditStanding: officer.creditStanding,
		yearStanding: officer.yearStanding,
		expectedGrad: officer.expectedGrad,
	};

	const {
		register,
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
		officer.netId,
		officer.creditStanding,
		officer.yearStanding,
		officer.expectedGrad.term,
		officer.expectedGrad.year,
		reset,
	]);

	const onSubmit = async (data: UpdateAcademicsFormData) => {
		try {
			await updateAcademicInfo({ officerId: officer.id, ...data });
			reset(data);
			toast.success("Academic info updated successfully");
		} catch (error) {
			toast.error("Failed to update academic info");
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<FieldGroup>
				<Field>
					<FieldContent>
						<FieldLabel htmlFor="netId" className="text-white/70">
							Net ID
						</FieldLabel>
						<Input
							id="netId"
							{...register("netId")}
							className="border-white/10 bg-white/5 text-white placeholder:text-white/50"
							placeholder="Enter your Net ID"
						/>
						<FieldError errors={[errors.netId]} />
					</FieldContent>
				</Field>

				<div className="grid grid-cols-2 gap-4">
					<Field>
						<FieldContent>
							<FieldLabel htmlFor="yearStanding" className="text-white/70">
								Standing (by year)
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
							<FieldLabel htmlFor="creditStanding" className="text-white/70">
								Standing (by credit)
							</FieldLabel>
							<Controller
								name="creditStanding"
								control={control}
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
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
								)}
							/>
							<FieldError errors={[errors.creditStanding]} />
						</FieldContent>
					</Field>
				</div>

				<Field>
					<FieldContent>
						<FieldLabel className="text-white/70">
							Expected Graduation
						</FieldLabel>
						<div className="flex space-x-2">
							<div className="flex-1">
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
							<div className="flex-1">
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
			</FieldGroup>

			<div className="flex justify-end">
				<Button
					type="submit"
					disabled={isPending || !isDirty}
					className="bg-acm-gradient"
				>
					{isPending ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</form>
	);
}
