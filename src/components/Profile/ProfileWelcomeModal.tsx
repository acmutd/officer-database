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
			<DialogContent className="max-w-md border-white/10 bg-gradient-to-br from-white/5 to-white/10 text-white backdrop-blur-xl">
				<DialogHeader className="items-center text-center">
					<div className="mb-2 flex items-center justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
							<img
								src="/peechi.png"
								alt="Peechi mascot"
								height={48}
								width={48}
								className="animate-none"
							/>
						</div>
					</div>
					<DialogTitle className="text-2xl font-semibold">
						Welcome to the ACM Officer Database!
					</DialogTitle>
					<DialogDescription className="text-white/60">
						Please fill out each tab with your information as we share this
						information with our sponsors.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3 text-sm text-white/70">
					<ul className="list-disc space-y-1 pl-5 text-left">
						<li>
							On the left: feel free to update your name, picture, and any links
							you'd like to share.
						</li>
						<li>
							Professional tab: Add any internship and research experience.
						</li>
						<li>
							Academics tab: Update your net id, credit standing, year standing,
							and expected graduation term and year.
						</li>
					</ul>
				</div>
				<DialogFooter className="sm:justify-center">
					<Button
						onClick={() => handleChange(false)}
						className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
					>
						Explore the database
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
