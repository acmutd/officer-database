import { Button } from "@/components/ui/button";
import { updateUserSocialsMutationOptions } from "@/queries/officer/socials";
import { SocialLinks } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface EditSocialsProps {
	links: SocialLinks;
}

export function EditSocials({ links }: EditSocialsProps) {
	const [socialLinks, setSocialLinks] = useState({
		linkedin: links.linkedin || "",
		github: links.github || "",
		personalEmail: links.personalEmail || "",
	});

	const { mutate, isPending, isError } = useMutation(
		updateUserSocialsMutationOptions
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newSocialObject = Object.fromEntries(
			Object.entries(socialLinks).filter(([_, value]) => value !== "")
		);
		mutate({ socials: newSocialObject });
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-4">
					<h3 className="text-xl font-semibold text-white">
						Edit Social Links
					</h3>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="linkedin"
								className="mb-2 block text-sm font-medium text-white/70"
							>
								LinkedIn URL
							</label>
							<input
								type="url"
								id="linkedin"
								value={socialLinks.linkedin}
								onChange={(e) =>
									setSocialLinks((prev) => ({
										...prev,
										linkedin: e.target.value,
									}))
								}
								className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
								placeholder="https://linkedin.com/in/username"
							/>
						</div>
						<div>
							<label
								htmlFor="github"
								className="mb-2 block text-sm font-medium text-white/70"
							>
								GitHub URL
							</label>
							<input
								type="url"
								id="github"
								value={socialLinks.github}
								onChange={(e) =>
									setSocialLinks((prev) => ({
										...prev,
										github: e.target.value,
									}))
								}
								className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
								placeholder="https://github.com/username"
							/>
						</div>
						<div>
							<label
								htmlFor="personalEmail"
								className="mb-2 block text-sm font-medium text-white/70"
							>
								Personal Email
							</label>
							<input
								type="email"
								id="personalEmail"
								className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
								value={socialLinks.personalEmail}
								onChange={(e) =>
									setSocialLinks((prev) => ({
										...prev,
										personalEmail: e.target.value,
									}))
								}
							/>
						</div>
					</div>
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
