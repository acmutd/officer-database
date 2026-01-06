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
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
	SortAsc,
	SortDesc,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	getCurrentOfficersQuery,
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
import {
	Table as UiTable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function Table() {
	const [view, setView] = useState<"current" | "past">("current");
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20,
	});

	const currentQuery =
		view === "past" ? getPastOfficersQuery : getCurrentOfficersQuery;
	const { data } = useSuspenseQuery(currentQuery);

	useEffect(() => {
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, [view]);

	const [search, setSearch] = useState("");
	const [columnFilters, setColumnFilters] = useState<any[]>([]);

	const columns = createColumns(view === "past");

	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: setPagination,
		state: {
			pagination,
			globalFilter: search,
			columnFilters,
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

	return (
		<div className="w-full space-y-6">
			<div className="flex items-center justify-between gap-4">
				<div className="relative max-w-2xl flex-1">
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
				<div className="flex items-center gap-3">
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
								"w-[200px] rounded-lg bg-black/30 text-sm text-white",
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
				</div>
			</div>

			<div className="rounded-lg border border-white/10 bg-black/30">
				<div className="max-h-[calc(100vh-280px)] overflow-y-auto">
					<UiTable className="min-w-[940px] border-collapse">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const isSorted = header.column.getIsSorted();
										return (
											<TableHead
												key={header.id}
												className={cn(
													"sticky top-0 z-10 bg-black/30 backdrop-blur-sm",
													"px-6 py-3 text-xs font-medium tracking-wider uppercase",
													"border-b border-white/10",
													"group cursor-pointer select-none",
													isSorted ? "text-white" : "text-white/70"
												)}
												onClick={() => header.column.toggleSorting()}
											>
												<div className="flex items-center gap-2">
													<span className="transition-colors group-hover:text-white">
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
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className={cn(
										"border-white/10 transition-colors hover:bg-white/5"
									)}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-6 py-2 text-sm">
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

				<div className="border-t border-white/10 bg-black/30 px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<span className="text-sm text-white/70">
								{table.getRowModel().rows.length} officers
							</span>
							<div className="flex items-center gap-2">
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
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5">
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
							</div>
							<div className="flex min-w-[100px] items-center justify-center gap-2">
								<span className="text-sm font-medium text-white">
									{pagination.pageIndex + 1}
								</span>
								<span className="text-sm text-white/50">of</span>
								<span className="text-sm font-medium text-white">
									{table.getPageCount()}
								</span>
							</div>
							<div className="flex items-center gap-1.5">
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
			</div>
		</div>
	);
}
