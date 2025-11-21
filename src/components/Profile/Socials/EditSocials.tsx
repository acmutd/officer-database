import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Github, Linkedin, Loader2, Mail } from "lucide-react";

import type { SocialLinks } from "@/schemas/officer";
import { updateSocialsMutation } from "@/queries/socials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";

type EditSocialsProps = {
	links: SocialLinks;
	onCancel?: () => void;
	onSuccess?: () => void;
};

const urlValidator = z.url();
const emailValidator = z.email();

const SocialLinksFormSchema = z.object({
	linkedin: z
		.string()
		.trim()
		.optional()
		.refine(
			(value) =>
				!value || value.length === 0 || urlValidator.safeParse(value).success,
			{ message: "Please enter a valid URL" }
		),
	github: z
		.string()
		.trim()
		.optional()
		.refine(
			(value) =>
				!value || value.length === 0 || urlValidator.safeParse(value).success,
			{ message: "Please enter a valid URL" }
		),
	personalEmail: z
		.string()
		.trim()
		.optional()
		.refine(
			(value) =>
				!value || value.length === 0 || emailValidator.safeParse(value).success,
			{ message: "Please enter a valid email" }
		),
});

const fieldContainerClassName =
	"rounded-xl border border-transparent transition-all duration-200";
const fieldLabelClassName =
	"flex items-center justify-between font-semibold uppercase text-white/65";
const optionalBadgeClassName =
	"rounded-full px-2 text-xs font-medium uppercase text-white/40";
const inputIconClassName =
	"pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2";
const inputClassName =
	"h-10 rounded-lg border-white/15 bg-transparent pl-10 text-sm text-white/90 placeholder:text-white/45 transition-all duration-200 hover:border-white/30 focus-visible:border-white/40 focus-visible:ring-white/45 disabled:opacity-60";

type SocialLinksFormValues = z.infer<typeof SocialLinksFormSchema>;

export function EditSocials({ links, onCancel, onSuccess }: EditSocialsProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<SocialLinksFormValues>({
		resolver: zodResolver(SocialLinksFormSchema),
		defaultValues: {
			linkedin: links.linkedin ?? "",
			github: links.github ?? "",
			personalEmail: links.personalEmail ?? "",
		},
	});

	const { mutateAsync: mutateSocials, isPending } = useMutation(
		updateSocialsMutation
	);

	useEffect(() => {
		reset({
			linkedin: links.linkedin ?? "",
			github: links.github ?? "",
			personalEmail: links.personalEmail ?? "",
		});
	}, [links.github, links.linkedin, links.personalEmail, reset]);

	const onSubmit = async (values: SocialLinksFormValues) => {
		const updated: SocialLinks = { ...links };

		const applyField = (
			field: keyof SocialLinks,
			value: SocialLinksFormValues[keyof SocialLinksFormValues]
		) => {
			if (typeof value === "undefined") {
				return;
			}

			const trimmed = value.trim();
			if (!trimmed) {
				delete updated[field];
				return;
			}

			updated[field] = trimmed;
		};

		applyField("linkedin", values.linkedin);
		applyField("github", values.github);
		applyField("personalEmail", values.personalEmail);

		try {
			await mutateSocials(updated);
			reset({
				linkedin: updated.linkedin ?? "",
				github: updated.github ?? "",
				personalEmail: updated.personalEmail ?? "",
			});
			toast.success("Social links updated successfully");
			onSuccess?.();
		} catch (error) {
			console.error(error);
			toast.error("Failed to update social links");
		}
	};

	const handleCancel = () => {
		reset({
			linkedin: links.linkedin ?? "",
			github: links.github ?? "",
			personalEmail: links.personalEmail ?? "",
		});
		onCancel?.();
	};

	const showCancel = Boolean(onCancel);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-sm">
			<FieldGroup className="gap-6 rounded-2xl">
				<Field className={fieldContainerClassName}>
					<FieldLabel htmlFor="linkedin" className={fieldLabelClassName}>
						LinkedIn
						<span className={optionalBadgeClassName}>Optional</span>
					</FieldLabel>
					<FieldContent className="gap-3">
						<div className="relative">
							<Linkedin
								className={`${inputIconClassName} text-blue-300`}
								aria-hidden="true"
							/>
							<Input
								type="url"
								id="linkedin"
								placeholder="https://linkedin.com/in/username"
								{...register("linkedin")}
								disabled={isPending}
								className={inputClassName}
							/>
						</div>
						<FieldError errors={[errors.linkedin]} />
					</FieldContent>
				</Field>

				<Field className={fieldContainerClassName}>
					<FieldLabel htmlFor="github" className={fieldLabelClassName}>
						GitHub
						<span className={optionalBadgeClassName}>Optional</span>
					</FieldLabel>
					<FieldContent className="gap-3">
						<div className="relative">
							<Github
								className={`${inputIconClassName} text-white/70`}
								aria-hidden="true"
							/>
							<Input
								type="url"
								id="github"
								placeholder="https://github.com/username"
								{...register("github")}
								disabled={isPending}
								className={inputClassName}
							/>
						</div>
						<FieldError errors={[errors.github]} />
					</FieldContent>
				</Field>

				<Field className={fieldContainerClassName}>
					<FieldLabel htmlFor="personalEmail" className={fieldLabelClassName}>
						Personal Email
						<span className={optionalBadgeClassName}>Optional</span>
					</FieldLabel>
					<FieldContent className="gap-3">
						<div className="relative">
							<Mail
								className={`${inputIconClassName} text-purple-300`}
								aria-hidden="true"
							/>
							<Input
								type="email"
								id="personalEmail"
								placeholder="your.email@example.com"
								{...register("personalEmail")}
								disabled={isPending}
								className={inputClassName}
							/>
						</div>
						<FieldError errors={[errors.personalEmail]} />
					</FieldContent>
				</Field>
			</FieldGroup>

			<div className="flex w-full justify-end gap-2">
				{showCancel && (
					<Button
						type="button"
						variant="ghost"
						className="border-white/20 bg-white/10 px-6 text-white hover:bg-white/20"
						onClick={handleCancel}
						disabled={isPending}
					>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					className="h-9 bg-acm-gradient px-4 text-white transition"
					disabled={isPending || !isDirty}
				>
					{isPending ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						"Save Changes"
					)}
				</Button>
			</div>
		</form>
	);
}
