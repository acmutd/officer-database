import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ProfileWelcomeModalProps = {
	isNewUser: boolean;
};

export function ProfileWelcomeModal({ isNewUser }: ProfileWelcomeModalProps) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!isNewUser) {
			setIsOpen(false);
			return;
		}

		const hasVisitedProfile = localStorage.getItem("visitedProfile");
		if (hasVisitedProfile !== "true") {
			setIsOpen(true);
		}
	}, [isNewUser]);

	const handleChange = (open: boolean) => {
		if (!open) {
			localStorage.setItem("visitedProfile", "true");
		}
		setIsOpen(open);
	};

	if (!isNewUser) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleChange}>

			<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			className="max-w-md border-white/10 bg-gradient-to-br from-white/5 to-white/10 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl">
				<DialogHeader className="items-center text-center">
					<div className="mb-4 flex items-center justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
							<img
								src="/peechi.png"
								alt="Peechi mascot"
								height={56}
								width={56}
								className="animate-none drop-shadow-lg"
							/>
						</div>
					</div>
					<DialogTitle className="text-2xl font-bold tracking-tight">
						Welcome to the ACM Officer Database!
					</DialogTitle>
					<DialogDescription className="text-white/60">
						Please fill out your profile information. This data helps us connect
						you with sponsors and opportunities.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4 text-sm text-white/70">
					<ul className="space-y-3 text-left">
						<li className="flex gap-3">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
								1
							</span>
							<span>
								<strong className="text-white">Profile Section:</strong> Update
								your name, picture, and social links. Other user will be able to
								view your profile. The info will also be available to the{" "}
								<a
									href="https://www.acmutd.co/officers"
									target="_blank"
									className="text-blue-500 hover:underline"
								>
									ACM website's officers page
								</a>
								.
							</span>
						</li>
						<li className="flex gap-3">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
								2
							</span>
							<span>
								<strong className="text-white">Background Tab:</strong> Add
								your internship and research experiences. Your resume will be
								private and only be visible to our sponsors.
							</span>
						</li>
						<li className="flex gap-3">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
								3
							</span>
							<span>
								<strong className="text-white">Academics Tab:</strong> Update
								your NetID, standing, and graduation details.
							</span>
						</li>
					</ul>
				</div>
				<DialogFooter className="sm:justify-center">
					<Button
						data-haptic="nudge"
						onClick={() => handleChange(false)}
						className="h-11 rounded-full bg-acm-gradient px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-acm-gradient/25"
					>
						Explore
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
