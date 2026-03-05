import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOfficerImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Photo } from "@/schemas/officer";

type UserAvatarProps = {
	photo: Photo;
	firstName: string;
	lastName: string;
} & React.ComponentProps<typeof Avatar>;

export function UserAvatar({
	photo,
	firstName,
	lastName,
	...props
}: UserAvatarProps) {
	const initials = `${firstName?.[0] ?? ""}${
		lastName?.[0] ?? ""
	}`.toUpperCase();

	const avatar = getOfficerImageUrl(photo);

	return (
		<Avatar
			{...props}
			className={cn("relative h-36 w-36", props.className)}
		>
			{photo.url && (
				<AvatarImage
					src={avatar}
					alt={`${firstName} ${lastName}`}
					className="rounded-full object-cover"
				/>
			)}
			<AvatarFallback className="bg-linear-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
				{initials}
			</AvatarFallback>
		</Avatar>
	);
}
