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
import { useForm } from "react-hook-form";
import { toast } from "@/lib/toast";
import { z } from "zod";

const AdminOfficerOnboardingSchema = CreateWorkspaceOfficerSchema.extend({
	selectedGroups: z.array(z.string()).optional(),
}).omit({ groups: true });

type AdminOfficerOnboardingForm = z.infer<typeof AdminOfficerOnboardingSchema>;

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

export function AdminOfficerOnboarding() {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isDirty },
		reset,
	} = useForm<AdminOfficerOnboardingForm>({
		resolver: zodResolver(AdminOfficerOnboardingSchema),
		defaultValues: {
			first_name: "",
			last_name: "",
			org_unit_path: "",
			send_to_email: "",
			selectedGroups: [],
		},
	});

	const { mutateAsync, isPending } = useMutation(createWorkspaceOfficerMutation);
	const selectedGroups = watch("selectedGroups") ?? [];
	const selectedOrgUnit = watch("org_unit_path");

	const onSubmit = async (data: AdminOfficerOnboardingForm) => {
		const groups = (data.selectedGroups ?? []).map(toGroupEmail);

		const parsedPayload = CreateWorkspaceOfficerSchema.safeParse({
			first_name: data.first_name,
			last_name: data.last_name,
			org_unit_path: data.org_unit_path,
			send_to_email: data.send_to_email,
			groups,
		});

		if (!parsedPayload.success) {
			toast.error(parsedPayload.error.issues[0]?.message ?? "Invalid form data");
			return;
		}

		try {
			const response = await mutateAsync(parsedPayload.data);
			if (response.failed_groups.length > 0) {
				toast.warning(
					`Account created. ${response.failed_groups.length} group assignment(s) failed.`
				);
			} else {
				toast.success("ACM account created and onboarding email sent.");
			}
			reset();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to create ACM account"
			);
		}
	};

	return (
		<Card className="rounded-xl border border-white/10 bg-black/40 shadow-xl">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold text-white">
					Officer Onboarding
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2">
						<Field>
							<FieldContent>
								<FieldLabel htmlFor="first_name" className="text-white/70">
									First Name
								</FieldLabel>
								<Input
									id="first_name"
									className="border-white/10 bg-white/5 text-white"
									placeholder="Bobby"
									{...register("first_name")}
								/>
								<FieldError errors={[errors.first_name]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="last_name" className="text-white/70">
									Last Name
								</FieldLabel>
								<Input
									id="last_name"
									className="border-white/10 bg-white/5 text-white"
									placeholder="Balls"
									{...register("last_name")}
								/>
								<FieldError errors={[errors.last_name]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="send_to_email" className="text-white/70">
									Send To Email
								</FieldLabel>
								<Input
									id="send_to_email"
									type="email"
									placeholder="bobbyballs@gmail.com"
									className="border-white/10 bg-white/5 text-white"
									{...register("send_to_email")}
								/>
								<FieldError errors={[errors.send_to_email]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="org_unit_path" className="text-white/70">
									Division
								</FieldLabel>
								<Select
									value={selectedOrgUnit}
									onValueChange={(value) => {
										setValue("org_unit_path", value, { shouldDirty: true });
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
								<input type="hidden" {...register("org_unit_path")} />
								<FieldError errors={[errors.org_unit_path]} />
							</FieldContent>
						</Field>
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
							type="button"
							onClick={() => reset()}
							disabled={isPending || !isDirty}
							className="bg-white/10 text-white hover:bg-white/20"
						>
							Add Another Officer
						</Button>
						<Button
							type="submit"
							disabled={isPending || !isDirty}
							className="bg-white/10 text-white hover:bg-white/20"
						>
							{isPending ? "Onboarding..." : "Onboard Officer"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
