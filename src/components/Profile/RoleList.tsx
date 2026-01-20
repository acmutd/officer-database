import type { Role } from "@/schemas/officer";
import { Badge } from "./Badge";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";

type Props = {
	roles: Role[];
	showAll?: boolean;
};
export function RoleList({ roles, showAll = false }: Props) {
	const filteredRoles = roles.filter(
		(role) => role.endDate === null || showAll
	);
	// Sort by permission level (highest to lowest)
	const sortedRoles = [...filteredRoles].sort((a, b) => b.level - a.level);
	if (sortedRoles.length === 0) return null;
	const [firstRole, ...rest] = sortedRoles;
	return (
		<div className="flex flex-wrap items-center gap-2">
			<Badge role={firstRole} />
			{rest.length > 0 && <RestRoles roles={rest} />}
		</div>
	);
}

function RestRoles({ roles }: { roles: Role[] }) {
	return (
		<Popover>
			<PopoverTrigger onClick={(e) => e.stopPropagation()} className="cursor-pointer">
				<div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
					+{roles.length}
				</div>
			</PopoverTrigger>
			<PopoverContent className="rounded-lg border border-white/10 bg-black/30 p-4 shadow-lg backdrop-blur-xl">
				<div className="flex flex-col gap-2">
					{roles.map((role) => (
						<Badge key={role.title} role={role} />
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
