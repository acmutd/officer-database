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
import { FileSpreadsheet, Info, Upload } from "lucide-react";
import { useState } from "react";
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
	officers: z.array(SingleOfficerSchema).min(1, "Add at least one officer"),
});

const CsvOfficerRowSchema = CreateWorkspaceOfficerSchema.pick({
	first_name: true,
	last_name: true,
	send_to_email: true,
});

type AdminOfficerOnboardingForm = z.input<typeof AdminOfficerOnboardingSchema>;

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

function createEmptyOfficer() {
	return {
		first_name: "",
		last_name: "",
		send_to_email: "",
		org_unit_path: "",
	};
}

function parseCsvRows(text: string) {
	const rows: string[][] = [];
	let currentRow: string[] = [];
	let currentValue = "";
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];

		if (char === '"') {
			if (inQuotes && text[index + 1] === '"') {
				currentValue += '"';
				index += 1;
				continue;
			}

			inQuotes = !inQuotes;
			continue;
		}

		if (char === "," && !inQuotes) {
			currentRow.push(currentValue);
			currentValue = "";
			continue;
		}

		if ((char === "\n" || char === "\r") && !inQuotes) {
			if (char === "\r" && text[index + 1] === "\n") {
				index += 1;
			}

			currentRow.push(currentValue);
			rows.push(currentRow);
			currentRow = [];
			currentValue = "";
			continue;
		}

		currentValue += char;
	}

	if (inQuotes) {
		throw new Error("CSV contains an unclosed quoted value.");
	}

	if (currentValue.length > 0 || currentRow.length > 0) {
		currentRow.push(currentValue);
		rows.push(currentRow);
	}

	return rows;
}

export function AdminOfficerOnboarding() {
	const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
	const [csvFileName, setCsvFileName] = useState("");
	const [ignoreFirstRow, setIgnoreFirstRow] = useState(true);
	const [csvParseError, setCsvParseError] = useState<string | null>(null);

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
	const selectedBatchOrgUnit = watch("batch_org_unit_path") ?? "";

	const handleCsvImport = async () => {
		if (!selectedCsvFile) {
			const errorMessage = "Select a CSV file before importing.";
			setCsvParseError(errorMessage);
			toast.error(errorMessage);
			return;
		}

		if (!selectedCsvFile.name.toLowerCase().endsWith(".csv")) {
			const errorMessage = "Unsupported file type. Upload a .csv file.";
			setCsvParseError(errorMessage);
			toast.error(errorMessage);
			return;
		}

		try {
			const text = (await selectedCsvFile.text()).replace(/^\uFEFF/, "");
			const rows = parseCsvRows(text)
				.map((row) => row.map((value) => value.trim()))
				.filter((row) => row.some((value) => value.length > 0));

			const startIndex = ignoreFirstRow ? 1 : 0;

			if (rows.length <= startIndex) {
				throw new Error("CSV has no data rows to import.");
			}

			const parsedOfficers = rows.slice(startIndex).map((row, rowIndex) => {
				const csvRowNumber = rowIndex + startIndex + 1;

				if (row.length !== 3) {
					throw new Error(
						`Row ${csvRowNumber} must have exactly 3 columns: first name, last name, email.`
					);
				}

				const parsedRow = CsvOfficerRowSchema.safeParse({
					first_name: row[0],
					last_name: row[1],
					send_to_email: row[2],
				});

				if (!parsedRow.success) {
					throw new Error(
						`Row ${csvRowNumber} is invalid: ${
							parsedRow.error.issues[0]?.message ?? "Invalid data"
						}`
					);
				}

				return {
					...parsedRow.data,
					org_unit_path: "",
				};
			});

			replace(parsedOfficers);
			clearErrors("officers");
			setCsvParseError(null);
			toast.success(`Imported ${parsedOfficers.length} officer(s) from CSV.`);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to parse CSV file.";
			setCsvParseError(message);
			toast.error(message);
		}
	};

	const onSubmit = async (data: AdminOfficerOnboardingForm) => {
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
					groups: [],
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
		setCsvParseError(null);
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
						<div className="space-y-3">
							<Field>
								<FieldContent>
									<FieldLabel
										htmlFor="batch_org_unit_path"
										className="flex items-center gap-2 text-white/70"
									>
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

							<Field>
								<FieldContent>
									<div className="flex flex-wrap items-center gap-2">
										<FieldLabel
											htmlFor="officer-csv-upload"
											className="flex items-center gap-2 text-white/70"
										>
											Import Officers (CSV)
										</FieldLabel>
										<span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/70">
											<Info className="size-3" aria-hidden="true" />
											Optional
										</span>
									</div>
									<div className="mt-2 space-y-2.5">
										<input
											id="officer-csv-upload"
											type="file"
											accept=".csv,text/csv"
											disabled={isSubmitting}
											onChange={(event) => {
												const file = event.target.files?.[0] ?? null;
												setSelectedCsvFile(file);
												setCsvFileName(file?.name ?? "");
												setCsvParseError(null);
											}}
											className="sr-only"
										/>
										<div className="flex flex-wrap items-center gap-2">
											<label
												htmlFor="officer-csv-upload"
												className="inline-flex cursor-pointer items-center rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
											>
												<Upload className="mr-2 size-4" aria-hidden="true" />
												Choose CSV File
											</label>
											<p className="text-xs text-white/70">
												{csvFileName || "No file selected"}
											</p>
											<Button
												type="button"
												onClick={handleCsvImport}
												disabled={isSubmitting || !selectedCsvFile}
												className="ml-auto bg-white/10 text-white hover:bg-white/20"
											>
												<FileSpreadsheet className="mr-2 size-4" aria-hidden="true" />
												Parse CSV Into Cards
											</Button>
										</div>
										<label className="flex items-center gap-2 text-sm text-white/80">
											<input
												type="checkbox"
												checked={ignoreFirstRow}
												onChange={(event) => {
													setIgnoreFirstRow(event.target.checked);
													setCsvParseError(null);
												}}
												className="size-4 rounded border border-white/20 bg-white/5 accent-white"
											/>
											<span>Ignore first row (headers)</span>
										</label>
										<p className="flex items-start gap-2 text-xs text-white/60">
											<Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
											You can skip CSV and add officers manually below. Expected columns: first name, last name, email.
										</p>
										{csvParseError ? (
											<p className="text-xs text-red-300">{csvParseError}</p>
										) : null}
									</div>
								</FieldContent>
							</Field>
						</div>
					) : null}

					<div className="space-y-4">
						<div className={`flex items-center gap-3 ${mode === "batch" ? "justify-between" : "justify-end"}`}>
							{mode === "batch" ? (
								<h3 className="text-base font-medium text-white">Officers</h3>
							) : null}
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

					<div className="flex justify-end pt-2">
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