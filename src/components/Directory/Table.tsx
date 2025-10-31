"use client";

import {
	columns,
	currentDivisionFilter,
	divisions,
	fuzzyFilter,
	fuzzySort,
} from "@/config/table-columns";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllOfficersQueryOptions } from "@/queries/officer";

export function Table() {
	const { data } = useSuspenseQuery(getAllOfficersQueryOptions);

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20,
	});

	const [search, setSearch] = useState("");
	const [columnFilters, setColumnFilters] = useState<any[]>([]);

	const table = useReactTable({
		data,
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
	return (
		<div className="w-full space-y-6">
			<div className="flex items-center justify-between">
				<div className="relative max-w-2xl flex-1">
					<input
						type="text"
						placeholder="Search officers..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={cn(
							"w-full bg-black/30 text-white placeholder:text-white/50",
							"rounded-lg px-5 py-3 pl-11 text-sm",
							"focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:outline-none",
							"border border-white/10 transition-colors hover:border-white/20"
						)}
					/>
					<Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-white/50" />
				</div>
				<select
					value={(table.getColumn("roles")?.getFilterValue() as string) ?? ""}
					onChange={(e) =>
						table.getColumn("roles")?.setFilterValue(e.target.value)
					}
					className={cn(
						"rounded-lg bg-black/30 text-sm text-white",
						"border border-white/10 px-4 py-3",
						"focus:ring-2 focus:ring-white/10 focus:border-white/20 focus:outline-none",
						"transition-colors hover:border-white/20",
						"cursor-pointer appearance-none"
					)}
				>
					{divisions.map((division) => (
						<option key={division} value={division === "All" ? "" : division}>
							{division === "All" ? "All Divisions" : division}
						</option>
					))}
				</select>
			</div>

			<div className="rounded-lg border border-white/10 bg-black/30">
				<div className="overflow-x-auto">
					<div className="max-h-[calc(100vh-280px)] overflow-y-auto">
						<table className="w-full min-w-[940px] border-collapse">
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											const isSorted = header.column.getIsSorted();
											return (
												<th
													key={header.id}
													className={cn(
														"sticky top-0 z-10 bg-black/30 backdrop-blur-sm",
														"px-6 py-3 text-left text-xs font-medium tracking-wider uppercase",
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
												</th>
											);
										})}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className={cn(
											"border-b border-white/10 last:border-0",
											"transition-colors hover:bg-white/5"
										)}
									>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id} className="px-6 py-2 text-sm">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="border-t border-white/10 bg-black/30 px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="text-sm text-white/70">
									{table.getRowModel().rows.length} officers
								</span>
								<div className="flex items-center gap-2">
									<span className="text-sm text-white/50">Show</span>
									<select
										value={pagination.pageSize}
										onChange={(e) => {
											table.setPageSize(Number(e.target.value));
										}}
										className={cn(
											"rounded-md bg-black/30 text-sm text-white",
											"border border-white/10 px-2 py-1",
											"focus:ring-2 focus:ring-white/10 focus:outline-none",
											"cursor-pointer appearance-none"
										)}
									>
										{[20, 30, 40, 50].map((pageSize) => (
											<option key={pageSize} value={pageSize}>
												{pageSize} rows
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-1.5">
									<button
										onClick={() => table.firstPage()}
										disabled={!table.getCanPreviousPage()}
										className={cn(
											"rounded-md p-1.5",
											"bg-white/5 text-white",
											"transition-colors hover:bg-white/10",
											"border border-white/10",
											"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/5"
										)}
									>
										<svg
											className="h-4 w-4"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M11 17L6 12L11 7M18 17L13 12L18 7" />
										</svg>
									</button>
									<button
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										className={cn(
											"rounded-md p-1.5",
											"bg-white/5 text-white",
											"transition-colors hover:bg-white/10",
											"border border-white/10",
											"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/5"
										)}
									>
										<svg
											className="h-4 w-4"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M15 18L9 12L15 6" />
										</svg>
									</button>
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
									<button
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										className={cn(
											"rounded-md p-1.5",
											"bg-white/5 text-white",
											"transition-colors hover:bg-white/10",
											"border border-white/10",
											"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/5"
										)}
									>
										<svg
											className="h-4 w-4"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M9 6L15 12L9 18" />
										</svg>
									</button>
									<button
										onClick={() => table.lastPage()}
										disabled={!table.getCanNextPage()}
										className={cn(
											"rounded-md p-1.5",
											"bg-white/5 text-white",
											"transition-colors hover:bg-white/10",
											"border border-white/10",
											"disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/5"
										)}
									>
										<svg
											className="h-4 w-4"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M13 7L18 12L13 17M6 7L11 12L6 17" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
