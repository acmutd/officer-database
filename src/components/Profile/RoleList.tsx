import { Role } from "@/schemas/officer";
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
	if (filteredRoles.length === 0) return null;
	const [firstRole, ...rest] = filteredRoles;
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
			<PopoverTrigger className="cursor-pointer">
				<div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
					+{roles.length}
				</div>
			</PopoverTrigger>
			<PopoverContent className="rounded-lg border border-white/10 bg-[#111111] p-4 shadow-lg">
				<div className="flex flex-col gap-2">
					{roles.map((role) => (
						<Badge key={role.title} role={role} />
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
