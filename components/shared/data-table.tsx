"use client";

import {
	Download,
	Settings2,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Filter,
	X,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";
import * as React from "react";
import { EmptyState } from "./empty-state";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<T = any> {
	id: string;
	header: string;
	accessorKey?: keyof T;
	accessorFn?: (row: T) => any;
	cell?: (value: any, row: T) => React.ReactNode;
	sortable?: boolean;
	filterable?: boolean;
	filterFn?: (row: T, filterValue: string) => boolean;
	width?: string;
	minWidth?: string;
}

export interface DataTableProps<T = any> {
	data: T[];
	columns: DataTableColumn<T>[];
	height?: string;
	minHeight?: string;
	maxHeight?: string;
	enableColumnVisibility?: boolean;
	enableExport?: boolean;
	exportFileName?: string;
	onRowClick?: (row: T) => void;
	emptyStateTitle?: string;
	emptyStateDescription?: string;
	emptyStateAction?: React.ReactNode;
	className?: string;
}

export function DataTable<T = any>({
	data,
	columns,
	height,
	minHeight = "200px",
	maxHeight = "800px",
	enableColumnVisibility = true,
	enableExport = true,
	exportFileName = "export",
	onRowClick,
	emptyStateTitle = "No data available",
	emptyStateDescription,
	emptyStateAction,
	className,
}: DataTableProps<T>) {
	const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
		new Set(columns.map((col) => col.id))
	);
	const [sortConfig, setSortConfig] = React.useState<{
		columnId: string | null;
		direction: SortDirection;
	}>({ columnId: null, direction: null });
	const [columnFilters, setColumnFilters] = React.useState<
		Record<string, string>
	>({});

	const visibleColumnsArray = React.useMemo(() => {
		return columns.filter((col) => visibleColumns.has(col.id));
	}, [columns, visibleColumns]);

	// Helper function to get cell value - must be defined before useMemo
	const getCellValue = React.useCallback(
		(row: T, column: DataTableColumn<T>) => {
			if (column.accessorFn) {
				return column.accessorFn(row);
			}
			if (column.accessorKey) {
				return row[column.accessorKey];
			}
			return null;
		},
		[]
	);

	// Apply sorting and filtering
	const processedData = React.useMemo(() => {
		let result = [...data];

		// Apply column filters
		result = result.filter((row) => {
			return Object.entries(columnFilters).every(
				([columnId, filterValue]) => {
					if (!filterValue.trim()) return true;
					const column = columns.find((col) => col.id === columnId);
					if (!column) return true;

					if (column.filterFn) {
						return column.filterFn(row, filterValue);
					}

					// Default filter: case-insensitive string matching
					const cellValue = getCellValue(row, column);
					return String(cellValue ?? "")
						.toLowerCase()
						.includes(filterValue.toLowerCase());
				}
			);
		});

		// Apply sorting
		if (sortConfig.columnId && sortConfig.direction) {
			const column = columns.find(
				(col) => col.id === sortConfig.columnId
			);
			if (column) {
				result.sort((a, b) => {
					const aValue = getCellValue(a, column);
					const bValue = getCellValue(b, column);

					// Handle null/undefined
					if (aValue == null && bValue == null) return 0;
					if (aValue == null) return 1;
					if (bValue == null) return -1;

					// Compare values
					let comparison = 0;
					if (
						typeof aValue === "string" &&
						typeof bValue === "string"
					) {
						comparison = aValue.localeCompare(bValue);
					} else if (
						typeof aValue === "number" &&
						typeof bValue === "number"
					) {
						comparison = aValue - bValue;
					} else {
						comparison = String(aValue).localeCompare(
							String(bValue)
						);
					}

					return sortConfig.direction === "asc"
						? comparison
						: -comparison;
				});
			}
		}

		return result;
	}, [data, columnFilters, sortConfig, columns, getCellValue]);

	const toggleColumnVisibility = (columnId: string) => {
		setVisibleColumns((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(columnId)) {
				newSet.delete(columnId);
			} else {
				newSet.add(columnId);
			}
			return newSet;
		});
	};

	const handleSort = (columnId: string) => {
		setSortConfig((prev) => {
			if (prev.columnId === columnId) {
				// Cycle through: asc -> desc -> null
				if (prev.direction === "asc") {
					return { columnId, direction: "desc" };
				} else if (prev.direction === "desc") {
					return { columnId: null, direction: null };
				}
			}
			return { columnId, direction: "asc" };
		});
	};

	const handleFilterChange = (columnId: string, value: string) => {
		setColumnFilters((prev) => ({
			...prev,
			[columnId]: value,
		}));
	};

	const clearFilter = (columnId: string) => {
		setColumnFilters((prev) => {
			const newFilters = { ...prev };
			delete newFilters[columnId];
			return newFilters;
		});
	};

	const clearAllFilters = () => {
		setColumnFilters({});
	};

	const hasActiveFilters = Object.values(columnFilters).some(
		(v) => v.trim() !== ""
	);

	const exportToCSV = () => {
		const headers = visibleColumnsArray.map((col) => col.header);
		const rows = processedData.map((row) =>
			visibleColumnsArray.map((col) => {
				let value: any;
				if (col.accessorFn) {
					value = col.accessorFn(row);
				} else if (col.accessorKey) {
					value = row[col.accessorKey];
				} else {
					value = "";
				}
				// Convert React nodes to string if needed
				if (React.isValidElement(value)) {
					return "";
				}
				return value ?? "";
			})
		);

		const csvContent = [
			headers.join(","),
			...rows.map((row) =>
				row
					.map((cell) => {
						const str = String(cell ?? "");
						// Escape quotes and wrap in quotes if contains comma
						if (
							str.includes(",") ||
							str.includes('"') ||
							str.includes("\n")
						) {
							return `"${str.replace(/"/g, '""')}"`;
						}
						return str;
					})
					.join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;",
		});
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `${exportFileName}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportToXLSX = () => {
		const headers = visibleColumnsArray.map((col) => col.header);
		const rows = processedData.map((row) =>
			visibleColumnsArray.map((col) => {
				let value: any;
				if (col.accessorFn) {
					value = col.accessorFn(row);
				} else if (col.accessorKey) {
					value = row[col.accessorKey];
				} else {
					value = "";
				}
				// Convert React nodes to string if needed
				if (React.isValidElement(value)) {
					return "";
				}
				return value ?? "";
			})
		);

		const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
	};

	// Calculate dynamic height based on processed data length
	// Each row is approximately 48px, header is 40px
	const rowHeight = 48;
	const headerHeight = 40;

	// Parse min/max heights (remove 'px' if present)
	const parseHeight = (h: string) => parseInt(h.replace("px", "").trim());
	const minHeightValue = parseHeight(minHeight);
	const maxHeightValue = parseHeight(maxHeight);

	// Calculate total table height needed: header + (records * row height)
	const totalHeightNeeded = headerHeight + processedData.length * rowHeight;

	// If height is explicitly provided, use it; otherwise calculate dynamically
	let calculatedTotalHeight: number;
	if (height) {
		calculatedTotalHeight = parseHeight(height);
	} else {
		// Auto-adjust: if records fit within min, use min; if exceed max, use max; otherwise use actual height
		if (totalHeightNeeded < minHeightValue) {
			calculatedTotalHeight = minHeightValue;
		} else if (totalHeightNeeded > maxHeightValue) {
			calculatedTotalHeight = maxHeightValue;
		} else {
			calculatedTotalHeight = totalHeightNeeded;
		}
	}

	const tableHeight = `${calculatedTotalHeight}px`;

	return (
		<div className={cn("w-full flex flex-col space-y-4", className)}>
			{/* Toolbar */}
			{(enableColumnVisibility || enableExport || hasActiveFilters) && (
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex items-center gap-2 flex-wrap">
						{enableColumnVisibility && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="gap-2"
									>
										<Settings2 className="size-4" />
										<Label>Columns</Label>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-48"
								>
									<DropdownMenuLabel>
										Toggle columns
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{columns.map((column) => (
										<DropdownMenuCheckboxItem
											key={column.id}
											checked={visibleColumns.has(
												column.id
											)}
											onCheckedChange={() =>
												toggleColumnVisibility(
													column.id
												)
											}
										>
											{column.header}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}

						{hasActiveFilters && (
							<Button
								variant="outline"
								size="sm"
								onClick={clearAllFilters}
								className="gap-2"
							>
								<X className="size-4" />
								<Label>Clear Filters</Label>
							</Button>
						)}
					</div>

					{enableExport && (
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={exportToCSV}
								className="gap-2"
							>
								<Download className="size-4" />
								<Label>CSV</Label>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={exportToXLSX}
								className="gap-2"
							>
								<Download className="size-4" />
								<Label>XLSX</Label>
							</Button>
						</div>
					)}
				</div>
			)}

			{/* Table */}
			{processedData.length === 0 && data.length > 0 ? (
				<div
					className="w-full border rounded-md"
					style={{ minHeight, maxHeight }}
				>
					<EmptyState
						title="No results found"
						description="Try adjusting your filters to see more results."
						action={
							hasActiveFilters ? (
								<Button
									variant="outline"
									size="sm"
									onClick={clearAllFilters}
								>
									Clear Filters
								</Button>
							) : undefined
						}
					/>
				</div>
			) : processedData.length === 0 ? (
				<div
					className="w-full border rounded-md"
					style={{ minHeight, maxHeight }}
				>
					<EmptyState
						title={emptyStateTitle}
						description={emptyStateDescription}
						action={emptyStateAction}
					/>
				</div>
			) : (
				<div className="w-full border rounded-md overflow-hidden">
					<ScrollArea>
						<Table className="w-full">
							<TableHeader className="sticky top-0 z-10 bg-background border-b">
								<TableRow>
									{visibleColumnsArray.map((column) => (
										<TableHead
											key={column.id}
											style={{
												width: column.width,
												minWidth: column.minWidth,
											}}
											className="bg-background"
										>
											<div className="flex items-center justify-between gap-2">
												<Label className="font-medium flex-1 truncate">
													{column.header}
												</Label>
												<div className="flex items-center gap-1 shrink-0">
													{column.filterable && (
														<Popover>
															<PopoverTrigger
																asChild
															>
																<Button
																	variant="ghost"
																	size="icon"
																	className={cn(
																		"h-6 w-6",
																		columnFilters[
																			column
																				.id
																		] &&
																			"bg-primary/10 text-primary"
																	)}
																>
																	<Filter className="size-3" />
																</Button>
															</PopoverTrigger>
															<PopoverContent
																className="w-64"
																align="start"
															>
																<div className="space-y-2">
																	<div className="flex items-center justify-between">
																		<Label className="text-sm font-medium">
																			Filter{" "}
																			{
																				column.header
																			}
																		</Label>
																		{columnFilters[
																			column
																				.id
																		] && (
																			<Button
																				variant="ghost"
																				size="icon"
																				className="h-6 w-6"
																				onClick={() =>
																					clearFilter(
																						column.id
																					)
																				}
																			>
																				<X className="size-3" />
																			</Button>
																		)}
																	</div>
																	<Input
																		placeholder={`Filter ${column.header.toLowerCase()}...`}
																		value={
																			columnFilters[
																				column
																					.id
																			] ||
																			""
																		}
																		onChange={(
																			e
																		) =>
																			handleFilterChange(
																				column.id,
																				e
																					.target
																					.value
																			)
																		}
																	/>
																</div>
															</PopoverContent>
														</Popover>
													)}
													{column.sortable && (
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6"
															onClick={() =>
																handleSort(
																	column.id
																)
															}
														>
															{sortConfig.columnId ===
															column.id ? (
																sortConfig.direction ===
																"asc" ? (
																	<ArrowUp className="size-3" />
																) : (
																	<ArrowDown className="size-3" />
																)
															) : (
																<ArrowUpDown className="size-3 text-muted-foreground" />
															)}
														</Button>
													)}
												</div>
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{processedData.map((row, rowIndex) => {
									// Use row.id if available, otherwise use index
									const rowKey = (row as any)?.id ?? rowIndex;

									return (
										<TableRow
											key={rowKey}
											onClick={() => onRowClick?.(row)}
											className={
												onRowClick
													? "cursor-pointer"
													: ""
											}
										>
											{visibleColumnsArray.map(
												(column) => {
													const value = getCellValue(
														row,
														column
													);
													return (
														<TableCell
															key={column.id}
															style={{
																width: column.width,
																minWidth:
																	column.minWidth,
															}}
															className="align-top"
														>
															{column.cell
																? column.cell(
																		value,
																		row
																  )
																: value != null
																? String(value)
																: ""}
														</TableCell>
													);
												}
											)}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</ScrollArea>
				</div>
			)}
		</div>
	);
}
