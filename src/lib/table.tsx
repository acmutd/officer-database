import { type Officer } from "../schemas/officer";
import {
	createColumnHelper,
	type FilterFn,
	type SortingFn,
	sortingFns,
} from "@tanstack/react-table";
import { UserAvatar } from "@/components/Profile/UserAvatar";
import {
	compareItems,
	type RankingInfo,
	rankItem,
} from "@tanstack/match-sorter-utils";
import { RoleList } from "@/components/Profile/RoleList";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const divisions = [
	"All",
	"Media",
	"Research",
	"Development",
	"Projects",
	"Education",
	"Executive",
	"Community",
	"HackUTD",
	"Industry",
];

export const currentDivisionFilter: FilterFn<Officer> = (
	row,
	_,
	filterValue
) => {
	if (filterValue === "") return true;
	const currentRole = row.original.roles.filter(
		(role) => role.endDate === null
	);
	return currentRole.some((role) => role.division === filterValue);
};

export const fuzzyFilter: FilterFn<Officer> = (
	row,
	columnId,
	filterValue,
	addMeta
) => {
	const itemRank = rankItem<Officer>(row.getValue(columnId), filterValue, {
		accessors: [
			(item) => `${item.firstName} ${item.lastName}`,
			(item) => item.netId,
		],
	});
	addMeta({ itemRank });
	return itemRank.passed;
};

export const fuzzySort: SortingFn<Officer> = (rowA, rowB, columnId) => {
	let dir = 0;

	// Only sort by rank if the column has ranking information
	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId]?.itemRank!,
			rowB.columnFiltersMeta[columnId]?.itemRank!
		);
	}

	// Provide an alphanumeric fallback for when the item ranks are equal
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

const nameSort: SortingFn<Officer> = (a, b) => {
	const aName = `${a.original.firstName} ${a.original.lastName}`;
	const bName = `${b.original.firstName} ${b.original.lastName}`;
	return aName.localeCompare(bName, undefined, { sensitivity: "base" });
};

const joinDateSort: SortingFn<Officer> = (a, b) => {
	const aYear = a.original.joinDate.year;
	const bYear = b.original.joinDate.year;
	if (aYear > bYear) return 1;
	if (aYear < bYear) return -1;

	const aTerm = a.original.joinDate.term;
	const bTerm = b.original.joinDate.term;
	const termOrder = ["Spring", "Summer", "Fall"] as const;
	const aTermIndex = termOrder.indexOf(aTerm);
	const bTermIndex = termOrder.indexOf(bTerm);
	if (aTermIndex > bTermIndex) return 1;
	if (aTermIndex < bTermIndex) return -1;

	return 0;
};

const expectedGradSort: SortingFn<Officer> = (a, b) => {
	const standingOrder = [
		"Graduate",
		"Senior",
		"Junior",
		"Sophomore",
		"Freshman",
		"Alumni",
	] as const;

	const aStandingIndex = standingOrder.indexOf(a.original.yearStanding);
	const bStandingIndex = standingOrder.indexOf(b.original.yearStanding);

	if (aStandingIndex !== bStandingIndex) {
		return aStandingIndex - bStandingIndex;
	}

	const aYear = a.original.expectedGrad.year;
	const bYear = b.original.expectedGrad.year;
	if (aYear !== bYear) return aYear - bYear;

	const aTerm = a.original.expectedGrad.term;
	const bTerm = b.original.expectedGrad.term;
	const termOrder = ["Spring", "Summer", "Fall"] as const;
	const aTermIndex = termOrder.indexOf(aTerm);
	const bTermIndex = termOrder.indexOf(bTerm);

	return aTermIndex - bTermIndex;
};

const rolesSort: SortingFn<Officer> = (a, b) => {
	const aRoles = a.original.roles.filter((role) => role.endDate === null);
	const bRoles = b.original.roles.filter((role) => role.endDate === null);

	const getHighestRole = (roles: typeof aRoles) => {
		if (roles.length === 0) return { division: "zzz", level: 0, title: "" };

		const execRole = roles.find((role) => role.division === "Executive");
		if (execRole) return { division: "Executive", level: execRole.level, title: execRole.title };

		const highestLevelRole = roles.reduce((highest, role) =>
			role.level > highest.level ? role : highest
		);
		return {
			division: highestLevelRole.division,
			level: highestLevelRole.level,
			title: highestLevelRole.title,
		};
	};

	const aHighest = getHighestRole(aRoles);
	const bHighest = getHighestRole(bRoles);

	if (
		aHighest.division === "Executive" &&
		bHighest.division !== "Executive"
	)
		return -1;
	if (
		bHighest.division === "Executive" &&
		aHighest.division !== "Executive"
	)
		return 1;

	if (aHighest.division !== bHighest.division) {
		return aHighest.division.localeCompare(bHighest.division);
	}

	if (aHighest.level !== bHighest.level) {
		return bHighest.level - aHighest.level;
	}

	if (aHighest.division === "Executive" && bHighest.division === "Executive") {
		const aIsPresident = aHighest.title.includes("President") && !aHighest.title.includes("Vice");
		const bIsPresident = bHighest.title.includes("President") && !bHighest.title.includes("Vice");
		if (aIsPresident && !bIsPresident) return -1;
		if (!aIsPresident && bIsPresident) return 1;
	}

	return bRoles.length - aRoles.length;
};

const activitySort: SortingFn<Officer> = (a, b) => {
	if (a.original.isActive === b.original.isActive) return 0;
	return a.original.isActive ? -1 : 1;
};

const columnHelper = createColumnHelper<Officer>();

export const createColumns = (isArchived: boolean) => [
	columnHelper.accessor(
		(row) => `${row.firstName} ${row.lastName} ${row.netId}`,
		{
			id: "name",
			header: () => <span className="text-white/70">Name</span>,
			cell: ({ row }) => {
				const officer = row.original;
				return (
					<Link
						className="flex w-[280px] min-w-[280px] items-center gap-4"
						to="/directory/$userId"
						params={{ userId: officer.id }}
						search={{ archived: isArchived }}
					>
						<UserAvatar
							firstName={officer.firstName}
							lastName={officer.lastName}
							photo={officer.photo}
							className="h-10 w-10 shrink-0 bg-white/10"
						/>
						<div className="min-w-0 truncate">
							<span className="block truncate font-medium text-white">
								{officer.firstName} {officer.lastName}
							</span>
							<span className="block truncate text-sm text-white/50">
								{officer.netId}
							</span>
						</div>
					</Link>
				);
			},
			sortingFn: nameSort,
		}
	),
	columnHelper.accessor("joinDate", {
		header: () => <span className="text-white/70">Join Date</span>,
		cell: ({ row }) => (
			<div className="w-40 min-w-40">
				<div className="flex flex-col">
					<span className="truncate text-xs text-white/50">
						{row.original.joinDate.term} {row.original.joinDate.year}
					</span>
				</div>
			</div>
		),
		sortingFn: joinDateSort,
	}),
	columnHelper.accessor("expectedGrad", {
		header: () => <span className="text-white/70">Expected Graduation</span>,
		cell: ({ row }) => (
			<div className="w-[180px] min-w-[180px]">
				<div className="flex flex-col">
					<span className="truncate text-white">
						{row.original.expectedGrad.term} {row.original.expectedGrad.year}
					</span>
					<span className="truncate text-xs text-white/50">
						{row.original.yearStanding}
					</span>
				</div>
			</div>
		),
		sortingFn: expectedGradSort,
	}),
	columnHelper.accessor("roles", {
		header: () => <span className="text-white/70">Current Roles</span>,
		filterFn: "currentDivision",
		cell: ({ row }) => (
			<div className="w-[320px] min-w-[320px]">
				<div className="flex flex-wrap gap-1.5">
					<RoleList roles={row.original.roles} />
				</div>
			</div>
		),
		sortingFn: rolesSort,
	}),
	columnHelper.accessor("isActive", {
		header: () => <span className="text-white/70">Active</span>,
		cell: ({ row }) => (
			<div className="w-40 min-w-40">
				<div
					className={cn(
						"inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
						row.original.isActive
							? "border-green-500/20 bg-green-500/10 text-green-400"
							: "border-red-500/20 bg-red-500/10 text-red-400"
					)}
				>
					<div
						className={cn(
							"h-1.5 w-1.5 rounded-full shadow-[0_0_8px]",
							row.original.isActive
								? "bg-green-400 shadow-green-500/50"
								: "bg-red-400 shadow-red-500/50"
						)}
					/>
					{row.original.isActive ? "Active" : "Inactive"}
				</div>
			</div>
		),
		sortingFn: activitySort,
	}),
];

export const columns = createColumns(false);

declare module "@tanstack/react-table" {
	interface FilterFns {
		fuzzy: FilterFn<Officer>;
		currentDivision: FilterFn<Officer>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}
