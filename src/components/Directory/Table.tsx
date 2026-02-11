import {
	createColumns,
	currentDivisionFilter,
	divisions,
	fuzzyFilter,
	fuzzySort,
} from "@/lib/table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Download,
	Search,
	SortAsc,
	SortDesc,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	getCurrentOfficersQuery,
	getOfficerQuery,
	getPastOfficersQuery,
} from "@/queries/officer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { UserAvatar } from "@/components/Profile/UserAvatar";
import { RoleList } from "@/components/Profile/RoleList";
import {
	Table as UiTable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { isAdmin } from "@/lib/admin";

export default function Table() {
	const [view, setView] = useState<"current" | "past">("current");
	const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: isMobile ? 10 : 20,
	});

	const currentQuery =
		view === "past" ? getPastOfficersQuery : getCurrentOfficersQuery;
	const { data } = useSuspenseQuery(currentQuery);
	const { data: currentOfficer } = useSuspenseQuery(getOfficerQuery);

	useEffect(() => {
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, [view]);

	const [search, setSearch] = useState("");
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = createColumns(view === "past");

	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		state: {
			pagination,
			globalFilter: search,
			columnFilters,
			sorting,
		},
		onGlobalFilterChange: setSearch,
		onColumnFiltersChange: setColumnFilters,
		filterFns: {
			fuzzy: fuzzyFilter,
			currentDivision: currentDivisionFilter,
		},
		sortingFns: {
			fuzzy: fuzzySort,
		},
	});
	const divisionColumn = table.getColumn("roles");
	const divisionFilterValue =
		(divisionColumn?.getFilterValue() as string | undefined) ?? "all";
	const exportRows = () => {
		let rowsToExport = table.getPrePaginationRowModel().rows;

		// Filter by selected division if one is selected
		if (divisionFilterValue !== "all") {
			rowsToExport = rowsToExport.filter((row) => {
				const officer = row.original;
				const currentRole = officer.roles.filter((role) => role.endDate === null);
				return currentRole.some((role) => role.division === divisionFilterValue);
			});
		}

		if (rowsToExport.length === 0) return;

		const escapeCsvValue = (value: string) => {
			if (value.includes("\"")) {
				value = value.replace(/\"/g, "\"\"");
			}
			if (value.includes(",") || value.includes("\n") || value.includes("\r")) {
				return `"${value}"`;
			}
			return value;
		};

		const formatTerm = (term: { term: string; year: number }) =>
			`${term.term} ${term.year}`;

		const rows = rowsToExport.map((row) => {
			const officer = row.original;
			const roles = officer.roles
				.filter((role) => (view === "current" ? role.endDate === null : true))
				.map((role) => `${role.title} (${role.division})`)
				.join("; ");
			const highestLevel =
				officer.roles.length === 0
					? 0
					: Math.max(...officer.roles.map((role) => role.level));
			const levelLabel =
				highestLevel === 3
					? "Executive"
					: highestLevel === 2
						? "Director"
						: "Officer";
			return [
				`${officer.firstName} ${officer.lastName}`,
				levelLabel,
				officer.netId,
				formatTerm(officer.joinDate),
				formatTerm(officer.expectedGrad),
				officer.yearStanding,
				roles,
				officer.isActive ? "Active" : "Inactive",
			];
		});

		const headers = [
			"Name",
			"Level",
			"NetID",
			"Join Date",
			"Expected Graduation",
			"Year Standing",
			view === "current" ? "Current Roles" : "Roles",
			"Active",
		];
		const csv = [headers, ...rows]
			.map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
			.join("\n");

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const dateTag = new Date().toISOString().slice(0, 10);
		link.href = url;
		link.download = `officers-${view}-${dateTag}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const exportDisabled = table.getPrePaginationRowModel().rows.length === 0;
	const canViewExport = !!currentOfficer && isAdmin(currentOfficer);

	return (
		<div className="w-full flex flex-col space-y-6 md:h-full md:min-h-0">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
				<div className="relative w-full md:max-w-2xl md:flex-1">
					<Input
						type="search"
						placeholder="Search by name or netID "
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full bg-black/30 text-white placeholder:text-white/50",
							"rounded-lg pl-11 text-sm h-11",
							"border border-white/10 transition-colors hover:border-white/20",
							"focus-visible:ring-white/20 focus-visible:border-white/30"
						)}
					/>
					<Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/50" />
				</div>
				<div className="flex items-center gap-3 w-full md:w-auto">
					<div className="inline-flex rounded-lg border space-x-1 border-white/10 bg-black/30 p-1 text-sm text-white/70">
						<Button
							variant={view === "current" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"rounded-md px-3 py-2 text-xs font-medium",
								view === "current"
									? "bg-white/20 text-white hover:bg-white/30"
									: "text-white/70 hover:bg-white/10 hover:text-white"
							)}
							onClick={() => setView("current")}
						>
							Current
						</Button>
						<Button
							variant={view === "past" ? "default" : "ghost"}
							size="sm"
							className={cn(
								"rounded-md px-3 py-2 text-xs font-medium",
								view === "past"
									? "bg-white/20 text-white hover:bg-white/30"
									: "text-white/70 hover:bg-white/10 hover:text-white"
							)}
							onClick={() => setView("past")}
						>
							Past
						</Button>
					</div>

					<Select
						value={divisionFilterValue}
						onValueChange={(value) =>
							divisionColumn?.setFilterValue(value === "all" ? undefined : value)
						}
					>
						<SelectTrigger
							className={cn(
								"w-full sm:w-[200px] rounded-lg bg-black/30 text-sm text-white",
								"border border-white/10 transition-colors hover:border-white/20",
								"focus-visible:ring-white/20 focus-visible:border-white/30"
							)}
						>
							<SelectValue placeholder="All Divisions" />
						</SelectTrigger>
						<SelectContent className="bg-black/90 text-white border border-white/10">
							<SelectItem value="all">All Divisions</SelectItem>
							{divisions
								.filter((division) => division !== "All")
								.map((division) => (
									<SelectItem key={division} value={division}>
										{division}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
					{canViewExport ? (
						<Button
							variant="outline"
							size="icon-sm"
							onClick={exportRows}
							disabled={exportDisabled}
							aria-label="Export officers"
							className={cn(
								"bg-white/5 text-white hover:bg-white/10",
								"border-white/10 disabled:hover:bg-white/5"
							)}
						>
							<Download className="h-4 w-4" />
						</Button>
					) : null}
				</div>
			</div>

			<div className="flex md:hidden">
				<Select
					value={
						sorting.length > 0
							? `${sorting[0].id}-${sorting[0].desc ? "desc" : "asc"}`
							: "default"
					}
					onValueChange={(value) => {
						if (value === "default") {
							setSorting([]);
						} else {
							const [id, direction] = value.split("-");
							setSorting([{ id, desc: direction === "desc" }]);
						}
					}}
				>
					<SelectTrigger
						className={cn(
							"w-full rounded-lg bg-black/30 text-sm text-white",
							"border border-white/10 transition-colors hover:border-white/20",
							"focus-visible:ring-white/20 focus-visible:border-white/30"
						)}
					>
						<SelectValue placeholder="Sort by..." />
					</SelectTrigger>
					<SelectContent className="bg-black/90 text-white border border-white/10">
						<SelectItem value="default">Default</SelectItem>
						<SelectItem value="name-asc">Name (A-Z)</SelectItem>
						<SelectItem value="name-desc">Name (Z-A)</SelectItem>
						<SelectItem value="joinDate-desc">Join Date (Newest First)</SelectItem>
						<SelectItem value="joinDate-asc">Join Date (Oldest First)</SelectItem>
						<SelectItem value="expectedGrad-asc">
							Expected Graduation (Soonest)
						</SelectItem>
						<SelectItem value="expectedGrad-desc">
							Expected Graduation (Latest)
						</SelectItem>
						<SelectItem value="roles-asc">Role (Highest First)</SelectItem>
						<SelectItem value="roles-desc">Role (Lowest First)</SelectItem>
						<SelectItem value="isActive-asc">Activity (Active First)</SelectItem>
						<SelectItem value="isActive-desc">
							Activity (Inactive First)
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex md:hidden flex-col gap-3">
				{table.getRowModel().rows.map((row) => {
					const officer = row.original;
					return (
						<Link
							key={row.id}
							to="/directory/$userId"
							params={{ userId: officer.id }}
							className="block rounded-lg border border-white/10 bg-black/30 p-3 transition-colors hover:bg-white/5"
						>
							<div className="flex gap-3 items-center">
								<UserAvatar
									firstName={officer.firstName}
									lastName={officer.lastName}
									photo={officer.photo}
									className="h-12 w-12 shrink-0 bg-white/10"
								/>
								<div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
									<h3 className="text-base font-semibold text-white truncate leading-tight">
										{officer.firstName} {officer.lastName}
									</h3>
									<div className="text-xs scale-90 origin-left" onClick={(e) => e.stopPropagation()}>
										<RoleList roles={officer.roles} />
									</div>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<div
										className={cn(
											"h-2 w-2 rounded-full",
											officer.isActive ? "bg-green-400" : "bg-red-400"
										)}
									/>
									<ChevronRight className="h-4 w-4 text-white/50" />
								</div>
							</div>
						</Link>
					);
				})}
			</div>

			<div className="hidden md:flex flex-col rounded-lg border border-white/10 bg-black/30 min-h-0 flex-1">
				<UiTable className="min-w-[940px] border-collapse shrink-0" style={{ tableLayout: "fixed" }}>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const isSorted = header.column.getIsSorted();
									return (
										<TableHead
											key={header.id}
											className={cn(
												"bg-black/80 backdrop-blur-md",
												"px-6 py-3 text-xs font-medium tracking-wider uppercase",
												"border-b border-white/10 first:rounded-tl-lg last:rounded-tr-lg",
												"group select-none align-middle",
												isSorted ? "text-white" : "text-white/70"
											)}
											onClick={() => header.column.toggleSorting()}
											style={{ width: header.getSize() }}
										>
											<div className="flex items-center gap-2">
												<span className="transition-colors">
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext()
															)}
												</span>
												{!header.isPlaceholder && (
													<div
														className={cn(
															"opacity-0 transition-opacity group-hover:opacity-100",
															isSorted && "opacity-100"
														)}
													>
														{isSorted === "asc" ? (
															<SortAsc className="h-3.5 w-3.5 text-white/50" />
														) : isSorted === "desc" ? (
															<SortDesc className="h-3.5 w-3.5 text-white/50" />
														) : null}
													</div>
												)}
											</div>
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
				</UiTable>
				<div className="overflow-y-auto flex-1">
					<UiTable className="min-w-[940px] border-collapse" style={{ tableLayout: "fixed" }}>
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className={cn(
										"border-white/10 transition-colors hover:bg-white/5"
									)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-6 py-2 text-sm align-middle" style={{ width: cell.column.getSize() }}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</UiTable>
				</div>
			</div>

			<div className="rounded-lg border border-white/10 bg-black/30 px-4 md:px-6 py-3 md:py-4 shrink-0 mb-8 md:mb-0">
				<div className="flex flex-col md:flex-row items-center md:justify-between gap-3">
					<div className="flex items-center gap-4">
						<span className="text-sm text-white/70">
							{table.getRowModel().rows.length} officers
						</span>
						<div className="hidden md:flex items-center gap-2">
							<span className="text-sm text-white/50">Show</span>
							<Select
								value={String(pagination.pageSize)}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger
									className={cn(
										"w-[110px] bg-black/30 text-sm text-white",
										"border border-white/10 transition-colors hover:border-white/20",
										"focus-visible:ring-white/20 focus-visible:border-white/30"
									)}
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-black/90 text-white border border-white/10">
									{[20, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={String(pageSize)}>
											{pageSize} rows
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex items-center gap-1.5 md:gap-3">
						<Button
							onClick={() => table.firstPage()}
							disabled={!table.getCanPreviousPage()}
							variant="outline"
							size="icon-sm"
							className={cn(
								"bg-white/5 text-white hover:bg-white/10",
								"border-white/10 disabled:hover:bg-white/5"
							)}
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							variant="outline"
							size="icon-sm"
							className={cn(
								"bg-white/5 text-white hover:bg-white/10",
								"border-white/10 disabled:hover:bg-white/5"
							)}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="flex min-w-20 md:min-w-[100px] items-center justify-center gap-2">
							<span className="text-sm font-medium text-white">
								{pagination.pageIndex + 1}
							</span>
							<span className="text-sm text-white/50">of</span>
							<span className="text-sm font-medium text-white">
								{table.getPageCount()}
							</span>
						</div>
						<Button
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							variant="outline"
							size="icon-sm"
							className={cn(
								"bg-white/5 text-white hover:bg-white/10",
								"border-white/10 disabled:hover:bg-white/5"
							)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							onClick={() => table.lastPage()}
							disabled={!table.getCanNextPage()}
							variant="outline"
							size="icon-sm"
							className={cn(
								"bg-white/5 text-white hover:bg-white/10",
								"border-white/10 disabled:hover:bg-white/5"
							)}
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
