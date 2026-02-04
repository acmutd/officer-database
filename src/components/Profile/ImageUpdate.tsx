import { Pencil, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { updateOfficerImageMutation } from "@/queries/officer";
import { toast } from "sonner";
import type { Photo } from "@/schemas/officer";
import { getOfficerImageUrl } from "@/lib/image";

type Props = {
	photo: Photo;
	officerId: string;
	firstName: string;
	lastName: string;
};

export function ImageUpdate({ photo, officerId, firstName, lastName }: Props) {
	const avatar = getOfficerImageUrl(photo);
	const { mutate: updateUserImage, isPending } = useMutation({
		...updateOfficerImageMutation,
		onSuccess: () => {
			toast.success("Image updated successfully", {
				action: {
					label: "Refresh",
					onClick: () => {
						window.location.reload();
					},
				},
			});
		},
		onError: () => {
			toast.error("Failed to update image");
		},
	});
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) {
			toast.error("Image size must be less than 10MB");
			return;
		}
		updateUserImage({ officerId, file });
	};

	return (
		<div className="group relative flex flex-col items-center">
			<Avatar className="h-36 w-36 shadow-2xl">
				{photo.url && (
					<AvatarImage
						src={avatar}
						alt="Profile"
						className="rounded-full object-cover"
					/>
				)}
				<AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
					{firstName[0] ?? ""}
					{lastName[0] ?? ""}
				</AvatarFallback>
			</Avatar>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				accept="image/*"
				className="hidden"
			/>
			<Button
				size="icon"
				variant="secondary"
				className="absolute -right-1 bottom-0 cursor-pointer rounded-full shadow-xl transition-shadow duration-300 hover:shadow-purple-500/20"
				onClick={handleImageClick}
				disabled={isPending}
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Pencil className="h-4 w-4" />
				)}
			</Button>
		</div>
	);
}
