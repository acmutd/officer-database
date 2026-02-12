import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Github, Instagram, Linkedin, Loader2, Mail } from "lucide-react";

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

const emailValidator = z.email();

const SOCIAL_PREFIXES = {
	linkedin: "https://linkedin.com/in/",
	github: "https://github.com/",
	instagram: "https://instagram.com/",
} as const;

const extractUsername = (url: string | undefined, prefix: string): string => {
	if (!url) return "";
	if (url.startsWith(prefix)) {
		return url.slice(prefix.length);
	}
	return url;
};

const buildUrl = (username: string, prefix: string): string => {
	if (!username) return "";
	return `${prefix}${username}`;
};

const SocialLinksFormSchema = z.object({
	linkedin: z.string().trim().optional(),
	github: z.string().trim().optional(),
	instagram: z.string().trim().optional(),
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
			linkedin: extractUsername(links.linkedin, SOCIAL_PREFIXES.linkedin),
			github: extractUsername(links.github, SOCIAL_PREFIXES.github),
			instagram: extractUsername(links.instagram, SOCIAL_PREFIXES.instagram),
			personalEmail: links.personalEmail ?? "",
		},
	});

	const { mutateAsync: mutateSocials, isPending } = useMutation(
		updateSocialsMutation
	);

	useEffect(() => {
		reset({
			linkedin: extractUsername(links.linkedin, SOCIAL_PREFIXES.linkedin),
			github: extractUsername(links.github, SOCIAL_PREFIXES.github),
			instagram: extractUsername(links.instagram, SOCIAL_PREFIXES.instagram),
			personalEmail: links.personalEmail ?? "",
		});
	}, [links.github, links.instagram, links.linkedin, links.personalEmail, reset]);

	const onSubmit = async (values: SocialLinksFormValues) => {
		const updated: SocialLinks = { ...links };

		const applyField = (
			field: keyof SocialLinks,
			value: SocialLinksFormValues[keyof SocialLinksFormValues],
			prefix?: string
		) => {
			if (typeof value === "undefined") {
				return;
			}

			const trimmed = value.trim();
			if (!trimmed) {
				delete updated[field];
				return;
			}

			updated[field] = prefix ? buildUrl(trimmed, prefix) : trimmed;
		};

		applyField("linkedin", values.linkedin, SOCIAL_PREFIXES.linkedin);
		applyField("github", values.github, SOCIAL_PREFIXES.github);
		applyField("instagram", values.instagram, SOCIAL_PREFIXES.instagram);
		applyField("personalEmail", values.personalEmail);

		try {
			await mutateSocials(updated);
			reset({
				linkedin: extractUsername(updated.linkedin, SOCIAL_PREFIXES.linkedin),
				github: extractUsername(updated.github, SOCIAL_PREFIXES.github),
				instagram: extractUsername(updated.instagram, SOCIAL_PREFIXES.instagram),
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
			linkedin: extractUsername(links.linkedin, SOCIAL_PREFIXES.linkedin),
			github: extractUsername(links.github, SOCIAL_PREFIXES.github),
			instagram: extractUsername(links.instagram, SOCIAL_PREFIXES.instagram),
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
								type="text"
								id="linkedin"
								placeholder="username"
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
								type="text"
								id="github"
								placeholder="username"
								{...register("github")}
								disabled={isPending}
								className={inputClassName}
							/>
						</div>
						<FieldError errors={[errors.github]} />
					</FieldContent>
				</Field>

				<Field className={fieldContainerClassName}>
					<FieldLabel htmlFor="instagram" className={fieldLabelClassName}>
						Instagram
						<span className={optionalBadgeClassName}>Optional</span>
					</FieldLabel>
					<FieldContent className="gap-3">
						<div className="relative">
							<Instagram
								className={`${inputIconClassName} text-pink-300`}
								aria-hidden="true"
							/>
							<Input
								type="text"
								id="instagram"
								placeholder="username"
								{...register("instagram")}
								disabled={isPending}
								className={inputClassName}
							/>
						</div>
						<FieldError errors={[errors.instagram]} />
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
