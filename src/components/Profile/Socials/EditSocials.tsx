import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { updateUserSocialsMutationOptions } from "@/queries/officer/socials";
import { SocialLinks } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface EditSocialsProps {
	links: SocialLinks;
}

const EditSocialsFormSchema = z.object({
	linkedin: z
		.string()
		.optional()
		.refine((val) => !val || val === "" || z.url().safeParse(val).success, {
			message: "Please enter a valid URL",
		}),
	github: z
		.string()
		.optional()
		.refine((val) => !val || val === "" || z.url().safeParse(val).success, {
			message: "Please enter a valid URL",
		}),
	personalEmail: z
		.string()
		.optional()
		.refine((val) => !val || val === "" || z.email().safeParse(val).success, {
			message: "Please enter a valid email",
		}),
});

type EditSocialsFormData = z.infer<typeof EditSocialsFormSchema>;

export function EditSocials({ links }: EditSocialsProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EditSocialsFormData>({
		resolver: zodResolver(EditSocialsFormSchema),
		defaultValues: {
			linkedin: links.linkedin || "",
			github: links.github || "",
			personalEmail: links.personalEmail || "",
		},
	});

	const { mutate, isPending, isError } = useMutation(
		updateUserSocialsMutationOptions
	);

	const onSubmit = (data: EditSocialsFormData) => {
		const newSocialObject = Object.fromEntries(
			Object.entries(data).filter(([_, value]) => value !== "")
		);
		mutate({ socials: newSocialObject });
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-white">
						Edit Social Links
					</h3>
					<FieldGroup>
						<Field>
							<FieldContent>
								<FieldLabel htmlFor="linkedin" className="text-white/70">
									LinkedIn URL
								</FieldLabel>
								<Input
									type="url"
									id="linkedin"
									{...register("linkedin")}
									className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50"
									placeholder="https://linkedin.com/in/username"
								/>
								<FieldError errors={[errors.linkedin]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="github" className="text-white/70">
									GitHub URL
								</FieldLabel>
								<Input
									type="url"
									id="github"
									{...register("github")}
									className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50"
									placeholder="https://github.com/username"
								/>
								<FieldError errors={[errors.github]} />
							</FieldContent>
						</Field>

						<Field>
							<FieldContent>
								<FieldLabel htmlFor="personalEmail" className="text-white/70">
									Personal Email
								</FieldLabel>
								<Input
									type="email"
									id="personalEmail"
									{...register("personalEmail")}
									className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50"
									placeholder="your.email@example.com"
								/>
								<FieldError errors={[errors.personalEmail]} />
							</FieldContent>
						</Field>
					</FieldGroup>
				</div>

				{isError && (
					<div className="text-sm text-red-500">
						Failed to update social links. Please try again.
					</div>
				)}

				<div className="flex justify-end gap-3">
					<Button
						type="submit"
						disabled={isPending}
						className="bg-acm-gradient"
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</div>
	);
}
