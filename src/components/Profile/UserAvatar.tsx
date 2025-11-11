import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
	officerId: string;
	firstName: string;
	lastName: string;
} & React.ComponentProps<typeof Avatar>;

export function UserAvatar({
	officerId,
	firstName,
	lastName,
	...props
}: UserAvatarProps) {
	const path = encodeURIComponent(`officers/${firstName}_${lastName}.webp`);
	const avatar = `https://firebasestorage.googleapis.com/v0/b/${import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${path}?alt=media`;
	const initials = `${firstName?.[0] ?? ""}${
		lastName?.[0] ?? ""
	}`.toUpperCase();

	return (
		<Avatar
			{...props}
			className={cn("relative h-36 w-36 ring-2 ring-white/10", props.className)}
		>
			<AvatarImage
				src={avatar}
				alt={`${firstName} ${lastName}`}
				className="rounded-full object-cover"
			/>
			<AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
				{initials}
			</AvatarFallback>
		</Avatar>
	);
}
