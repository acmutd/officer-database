import { Pencil, Loader2 } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

export function ImageUpdate() {
	// const { data, isLoading } = useSuspenseQuery(getUserImageQueryOptions);
	// const { mutate: updateUserImage, isPending } = useMutation(
	// 	updateUserImageMutationOptions
	// );
	// const fileInputRef = React.useRef<HTMLInputElement>(null);

	// const handleImageClick = () => {
	// 	fileInputRef.current?.click();
	// };

	// const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const file = e.target.files?.[0];
	// 	if (!file) return;
	// 	const formData = new FormData();
	// 	formData.append("image", file);
	// 	updateUserImage({ data: formData });
	// };

	return (
		<div className="group relative">
			<div className="bg-acm-gradient absolute -inset-0.5 rounded-full opacity-30 blur transition group-hover:opacity-50"></div>
			<Avatar className="relative h-36 w-36 ring-2 ring-white/10">
				{/* {!isPending && !isLoading && (
					<AvatarImage
						src={data}
						alt="Profile"
						className="rounded-full object-cover"
					/>
				)} */}
				<AvatarImage
					src="/peechi.png"
					alt="Profile"
					className="rounded-full object-cover"
				/>
			</Avatar>
			{/* <input
				type="file"
				ref={fileInputRef}
				onChange={handleImageChange}
				accept="image/*"
				className="hidden"
			/>
			<Button
				size="icon"
				variant="secondary"
				className="absolute -right-2 -bottom-2 cursor-pointer rounded-full shadow-xl transition-shadow duration-300 hover:shadow-purple-500/20"
				onClick={handleImageClick}
				disabled={isPending}
			>
				{isPending ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Pencil className="h-4 w-4" />
				)}
			</Button> */}
		</div>
	);
}
