"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Pagination as ShadcnPagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export interface PaginationData {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

interface SharedPaginationProps {
	pagination: PaginationData;
	onPageChange: (page: number) => void;
	onLimitChange?: (limit: number) => void;
	limitOptions?: number[];
	showLimitSelector?: boolean;
	className?: string;
}

export function Pagination({
	pagination,
	onPageChange,
	onLimitChange,
	limitOptions = [1, 5, 10, 20, 50, 100],
	showLimitSelector = true,
	className,
}: SharedPaginationProps) {
	const { t } = useTranslation();
	const { page, limit, totalPages, hasMore } = pagination;

	// Check if we should show pagination controls (only if more than 1 page)
	const shouldShowPagination = totalPages > 1;

	// Calculate which page numbers to show
	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			// Show all pages if total is less than max visible
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show pages with ellipsis
			if (page <= 3) {
				// Near the start
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push("ellipsis");
				pages.push(totalPages);
			} else if (page >= totalPages - 2) {
				// Near the end
				pages.push(1);
				pages.push("ellipsis");
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				// In the middle
				pages.push(1);
				pages.push("ellipsis");
				for (let i = page - 1; i <= page + 1; i++) {
					pages.push(i);
				}
				pages.push("ellipsis");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	const handlePageClick = (newPage: number, e?: React.MouseEvent) => {
		e?.preventDefault();
		if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
			onPageChange(newPage);
		}
	};

	const handlePrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		if (page > 1) {
			handlePageClick(page - 1);
		}
	};

	const handleNext = (e: React.MouseEvent) => {
		e.preventDefault();
		if (hasMore) {
			handlePageClick(page + 1);
		}
	};

	const handleLimitChange = (newLimit: string) => {
		const limitValue = parseInt(newLimit, 10);
		if (onLimitChange && limitValue !== limit) {
			onLimitChange(limitValue);
		}
	};

	// Don't render anything if there's no pagination and no limit selector
	if (!shouldShowPagination && (!showLimitSelector || !onLimitChange)) {
		return null;
	}

	return (
		<div className={cn("flex gap-4", className)}>
			{/* Pagination Controls */}
			<ShadcnPagination className="gap-5">
				{shouldShowPagination && (
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={handlePrevious}
								className={cn(
									page === 1 &&
										"pointer-events-none opacity-50 cursor-not-allowed"
								)}
								aria-disabled={page === 1}
							/>
						</PaginationItem>

						{pageNumbers.map((pageNum, index) => {
							if (pageNum === "ellipsis") {
								return (
									<PaginationItem key={`ellipsis-${index}`}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}

							return (
								<PaginationItem key={pageNum}>
									<PaginationLink
										href="#"
										onClick={(e) =>
											handlePageClick(pageNum, e)
										}
										isActive={pageNum === page}
										className={cn(
											"cursor-pointer",
											pageNum === page &&
												"pointer-events-none"
										)}
									>
										{pageNum}
									</PaginationLink>
								</PaginationItem>
							);
						})}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={handleNext}
								className={cn(
									!hasMore &&
										"pointer-events-none opacity-50 cursor-not-allowed"
								)}
								aria-disabled={!hasMore}
							/>
						</PaginationItem>
					</PaginationContent>
				)}
				{/* Limit Selector */}
				{showLimitSelector && onLimitChange && (
					<Select
						value={limit.toString()}
						onValueChange={handleLimitChange}
					>
						<SelectTrigger size="sm" className="w-[100px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{limitOptions.map((option) => (
								<SelectItem
									key={option}
									value={option.toString()}
								>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</ShadcnPagination>
		</div>
	);
}
