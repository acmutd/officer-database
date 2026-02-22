import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteResearchMutation } from "@/queries/research";
import type { Research } from "@/schemas/officer";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
	officerId?: string;
	research: Research;
	index: number;
};

export function DeleteResearchModal({ officerId, research, index }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const { mutateAsync: deleteResearch } = useMutation(deleteResearchMutation);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteResearch({ officerId, index });
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to delete research:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 rounded-full p-0 text-white/50 hover:bg-red-500/10 hover:text-red-400"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
					>
						<path d="M3 6h18" />
						<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
						<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					</svg>
				</Button>
			</DialogTrigger>
			<DialogContent className="border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
				<DialogHeader>
					<DialogTitle className="text-white">Delete Research</DialogTitle>
					<DialogDescription className="text-white/50">
						Are you sure you want to delete your research at {research.lab}?
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="ghost"
						onClick={() => setIsOpen(false)}
						className="text-white hover:bg-white/10"
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isDeleting}
						className="bg-red-500/10 text-red-400 hover:bg-red-500/20"
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
