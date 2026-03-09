import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createWorkspaceOfficerMutation } from "@/queries/admin";
import { CreateWorkspaceOfficerSchema } from "@/schemas/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SingleOfficerSchema = CreateWorkspaceOfficerSchema.pick({
	first_name: true,
	last_name: true,
	send_to_email: true,
}).extend({
	org_unit_path: z.string().optional(),
});

const AdminOfficerOnboardingSchema = z.object({
	mode: z.enum(["single", "batch"]).default("single"),
	batch_org_unit_path: z.string().optional(),
	selectedGroups: z.array(z.string()).default([]),
	officers: z.array(SingleOfficerSchema).min(1, "Add at least one officer"),
});

type AdminOfficerOnboardingForm = z.input<typeof AdminOfficerOnboardingSchema>;

const GROUP_OPTIONS = [
	"media",
	"research",
	"development",
	"projects",
	"education",
	"tip",
	"community",
	"outreach",
	"acmindustry",
	"finance-team",
	"hackutd",
	"hackutd-finance",
	"hackutd-logistics",
	"hackutdindustry",
	"hackutd-experience",
	"hackutd-marketing",
	"sponsor",
] as const;

const GROUP_ALIASES: Record<(typeof GROUP_OPTIONS)[number], string> = {
	media: "Media",
	research: "Research",
	development: "Development",
	projects: "Projects",
	acmindustry: "ACM Industry",
	education: "Education",
	tip: "TIP",
	community: "Community",
	outreach: "Outreach",
	"finance-team": "Finance Team",
	hackutd: "HackUTD",
	"hackutd-finance": "HackUTD Finance",
	"hackutd-logistics": "HackUTD Logistics",
	hackutdindustry: "HackUTD Industry",
	"hackutd-experience": "HackUTD Experience",
	"hackutd-marketing": "HackUTD Marketing",
	sponsor: "Sponsor",
};

const ORG_UNIT_OPTIONS = [
	{ label: "Media", value: "/Media" },
	{ label: "Research", value: "/Research" },
	{ label: "Development", value: "/Development" },
	{ label: "Projects", value: "/Projects" },
	{ label: "Education", value: "/Education" },
	{ label: "Community", value: "/Community" },
	{ label: "HackUTD", value: "/HackUTD" },
	{ label: "Industry", value: "/Industry" },
	{ label: "Sponsor", value: "/Sponsorship" },
];

function toGroupEmail(groupName: string) {
	return `${groupName}@acmutd.co`;
}

function createEmptyOfficer() {
	return {
		first_name: "",
		last_name: "",
		send_to_email: "",
		org_unit_path: "",
	};
}

export function AdminOfficerOnboarding() {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		setError,
		clearErrors,
		control,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AdminOfficerOnboardingForm>({
		resolver: zodResolver(AdminOfficerOnboardingSchema),
		defaultValues: {
			mode: "single",
			batch_org_unit_path: "",
			selectedGroups: [],
			officers: [createEmptyOfficer()],
		},
	});

	const { mutateAsync } = useMutation(createWorkspaceOfficerMutation);
	const { fields, append, remove, replace } = useFieldArray({
		control,
		name: "officers",
	});
	const mode = watch("mode");
	const officers = watch("officers") ?? [];
	const selectedGroups = watch("selectedGroups") ?? [];
	const selectedBatchOrgUnit = watch("batch_org_unit_path") ?? "";

	const onSubmit = async (data: AdminOfficerOnboardingForm) => {
		const groups = (data.selectedGroups ?? []).map(toGroupEmail);
		const total = data.officers.length;

		if (data.mode === "batch" && !data.batch_org_unit_path?.trim()) {
			setError("batch_org_unit_path", {
				type: "manual",
				message: "Division is required",
			});
			return;
		}

		const payloads = data.officers
			.map((officer, index) => {
				const orgUnitPath =
					data.mode === "batch"
						? data.batch_org_unit_path ?? ""
						: officer.org_unit_path ?? "";

				if (data.mode === "single" && !orgUnitPath.trim()) {
					setError(`officers.${index}.org_unit_path`, {
						type: "manual",
						message: "Division is required",
					});
					return null;
				}

				const parsed = CreateWorkspaceOfficerSchema.safeParse({
					first_name: officer.first_name,
					last_name: officer.last_name,
					send_to_email: officer.send_to_email,
					org_unit_path: orgUnitPath,
					groups,
				});

				if (!parsed.success) {
					toast.error(parsed.error.issues[0]?.message ?? "Invalid officer data");
					return null;
				}

				return parsed.data;
			})
			.filter((payload): payload is z.infer<typeof CreateWorkspaceOfficerSchema> =>
				payload !== null
			);

		if (payloads.length !== total) {
			return;
		}

		try {
			const settled = await Promise.allSettled(
				payloads.map((payload) => mutateAsync(payload))
			);

			const successCount = settled.filter(
				(result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof mutateAsync>>> =>
					result.status === "fulfilled"
			).length;
			const failureCount = total - successCount;
			const groupFailureCount = settled.reduce((count, result) => {
				if (result.status !== "fulfilled") {
					return count;
				}

				return count + result.value.failed_groups.length;
			}, 0);

			if (successCount === total) {
				if (groupFailureCount > 0) {
					toast.warning(
						`Onboarded ${successCount} officer(s). ${groupFailureCount} group assignment(s) failed.`
					);
				} else {
					toast.success(
						`Onboarded ${successCount} officer(s) and sent onboarding emails.`
					);
				}
			} else if (successCount > 0) {
				const firstFailure = settled.find(
					(result) => result.status === "rejected"
				) as PromiseRejectedResult | undefined;

				toast.warning(
					`Onboarded ${successCount}/${total} officer(s). ${failureCount} failed.${
						firstFailure
							? ` First error: ${
								firstFailure.reason instanceof Error
									? firstFailure.reason.message
									: "Request failed"
							}`
							: ""
					}`
				);
			} else {
				throw new Error("Failed to onboard all officers");
			}

			reset({
				mode: data.mode,
				batch_org_unit_path:
					data.mode === "batch"
						? data.batch_org_unit_path ?? ""
						: "",
				selectedGroups: data.selectedGroups ?? [],
				officers: [
					{
						...createEmptyOfficer(),
						org_unit_path:
							data.mode === "single"
								? (data.officers[0]?.org_unit_path ?? "")
								: "",
					},
				],
			});
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to onboard officers"
			);
		}
	};

	const switchMode = (nextMode: "single" | "batch") => {
		if (nextMode === mode) {
			return;
		}

		clearErrors();
		setValue("mode", nextMode, { shouldDirty: true });

		if (nextMode === "single") {
			replace([
				officers[0]
					? {
						first_name: officers[0].first_name,
						last_name: officers[0].last_name,
						send_to_email: officers[0].send_to_email,
						org_unit_path: officers[0].org_unit_path ?? "",
					}
					: createEmptyOfficer(),
			]);
			return;
		}

		if (fields.length === 0) {
			replace([createEmptyOfficer()]);
		}
	};

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader className="flex flex-row items-start justify-between gap-4">
				<CardTitle className="text-2xl font-semibold text-white">
					Officer Onboarding
				</CardTitle>
				<div className="inline-flex items-center rounded-lg border border-white/15 bg-white/5 p-1">
					<button
						type="button"
						onClick={() => switchMode("single")}
						disabled={isSubmitting}
						aria-pressed={mode === "single"}
						className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
							mode === "single"
								? "bg-white text-black"
								: "text-white/70 hover:text-white"
						}`}
					>
						Single
					</button>
					<button
						type="button"
						onClick={() => switchMode("batch")}
						disabled={isSubmitting}
						aria-pressed={mode === "batch"}
						className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
							mode === "batch"
								? "bg-white text-black"
								: "text-white/70 hover:text-white"
						}`}
					>
						Batch
					</button>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{mode === "batch" ? (
						<div className="grid gap-4 md:grid-cols-2">
							<Field>
								<FieldContent>
									<FieldLabel htmlFor="batch_org_unit_path" className="text-white/70">
										Division (All Officers)
									</FieldLabel>
									<Select
										value={selectedBatchOrgUnit}
										onValueChange={(value) => {
											clearErrors("batch_org_unit_path");
											setValue("batch_org_unit_path", value, { shouldDirty: true });
										}}
									>
										<SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
											<SelectValue placeholder="Select Unit" />
										</SelectTrigger>
										<SelectContent className="border-white/10 bg-[#101322] text-white">
											{ORG_UNIT_OPTIONS.map((unit) => (
												<SelectItem key={unit.value} value={unit.value}>
													{unit.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<input type="hidden" {...register("batch_org_unit_path")} />
									<FieldError errors={[errors.batch_org_unit_path]} />
								</FieldContent>
							</Field>
						</div>
					) : null}

					<div className="space-y-4">
						<div className="flex items-center justify-between gap-3">
							<h3 className="text-base font-medium text-white">Officers</h3>
							{mode === "batch" ? (
								<Button
									type="button"
									onClick={() => append(createEmptyOfficer())}
									disabled={isSubmitting}
									className="bg-white/10 text-white hover:bg-white/20"
								>
									Add Officer Card
								</Button>
							) : null}
						</div>

						{fields.map((field, index) => (
							<div
								key={field.id}
								className="rounded-lg border border-white/10 bg-white/5 p-4"
							>
								<div className="mb-3 flex items-center justify-between gap-3">
									<p className="text-sm font-medium text-white/90">
										Officer {index + 1}
									</p>
									{mode === "batch" ? (
										<Button
											type="button"
											onClick={() => remove(index)}
											disabled={isSubmitting || fields.length === 1}
											className="bg-white/10 text-white hover:bg-white/20"
										>
											Remove
										</Button>
									) : null}
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<Field>
										<FieldContent>
											<FieldLabel
												htmlFor={`officer-${index}-first_name`}
												className="text-white/70"
											>
												First Name
											</FieldLabel>
											<Input
												id={`officer-${index}-first_name`}
												className="border-white/10 bg-white/5 text-white"
												placeholder="Bobby"
												{...register(`officers.${index}.first_name`)}
											/>
											<FieldError errors={[errors.officers?.[index]?.first_name]} />
										</FieldContent>
									</Field>

									<Field>
										<FieldContent>
											<FieldLabel
												htmlFor={`officer-${index}-last_name`}
												className="text-white/70"
											>
												Last Name
											</FieldLabel>
											<Input
												id={`officer-${index}-last_name`}
												className="border-white/10 bg-white/5 text-white"
												placeholder="Balls"
												{...register(`officers.${index}.last_name`)}
											/>
											<FieldError errors={[errors.officers?.[index]?.last_name]} />
										</FieldContent>
									</Field>

									<Field className="md:col-span-2">
										<FieldContent>
											<FieldLabel
												htmlFor={`officer-${index}-send_to_email`}
												className="text-white/70"
											>
												Send To Email
											</FieldLabel>
											<Input
												id={`officer-${index}-send_to_email`}
												type="email"
												placeholder="bobbyballs@gmail.com"
												className="border-white/10 bg-white/5 text-white"
												{...register(`officers.${index}.send_to_email`)}
											/>
											<FieldError errors={[errors.officers?.[index]?.send_to_email]} />
										</FieldContent>
									</Field>

									{mode === "single" ? (
										<Field className="md:col-span-2">
											<FieldContent>
												<FieldLabel
													htmlFor={`officer-${index}-org_unit_path`}
													className="text-white/70"
												>
													Division
												</FieldLabel>
												<Select
													value={watch(`officers.${index}.org_unit_path`) ?? ""}
													onValueChange={(value) => {
														clearErrors(`officers.${index}.org_unit_path`);
														setValue(`officers.${index}.org_unit_path`, value, {
															shouldDirty: true,
														});
													}}
												>
													<SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
														<SelectValue placeholder="Select Unit" />
													</SelectTrigger>
													<SelectContent className="border-white/10 bg-[#101322] text-white">
														{ORG_UNIT_OPTIONS.map((unit) => (
															<SelectItem key={unit.value} value={unit.value}>
																{unit.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<input
													type="hidden"
													{...register(`officers.${index}.org_unit_path`)}
												/>
												<FieldError errors={[errors.officers?.[index]?.org_unit_path]} />
											</FieldContent>
										</Field>
									) : null}
								</div>
							</div>
						))}

						<FieldError errors={[errors.officers]} />
					</div>

					<Field>
						<FieldContent>
							<FieldLabel className="text-white/70">Groups</FieldLabel>
							<div className="grid grid-cols-1 gap-x-8 gap-y-2 pt-1 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-rows-6">
								{GROUP_OPTIONS.map((groupName) => {
									const checked = selectedGroups.includes(groupName);

									return (
										<label
											key={groupName}
											className="flex items-center gap-2 text-sm text-white/80"
										>
											<input
												type="checkbox"
												checked={checked}
												onChange={(event) => {
													if (event.target.checked) {
														setValue(
															"selectedGroups",
															[...selectedGroups, groupName],
															{ shouldDirty: true }
														);
														return;
													}

													setValue(
														"selectedGroups",
														selectedGroups.filter((value) => value !== groupName),
														{ shouldDirty: true }
													);
												}}
												className="size-4 rounded border border-white/20 bg-white/5 accent-white"
											/>
											<span>{GROUP_ALIASES[groupName]}</span>
										</label>
									);
								})}
							</div>
						</FieldContent>
					</Field>

					<div className="flex flex-wrap items-center gap-3 pt-2">
						<Button
							type="submit"
							disabled={isSubmitting || fields.length === 0}
							className="bg-white/10 text-white hover:bg-white/20"
						>
							{isSubmitting
								? "Onboarding..."
								: mode === "single"
									? "Onboard Officer"
									: "Onboard Officers"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}