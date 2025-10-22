import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
	firstName: string;
	lastName: string;
	src: string;
} & React.ComponentProps<typeof Avatar>;

export function UserAvatar({
	firstName,
	lastName,
	src,
	...props
}: UserAvatarProps) {
	return (
		<Avatar
			{...props}
			className={cn("relative h-36 w-36 ring-2 ring-white/10", props.className)}
		>
			<AvatarFallback className="bg-black/20 text-3xl">
				{firstName[0]} {lastName[0]}
			</AvatarFallback>
			<AvatarImage
				src={src}
				alt={`${firstName} ${lastName}`}
				className="rounded-full object-cover"
			/>
		</Avatar>
	);
}
