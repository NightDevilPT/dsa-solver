"use client";

import {
	ProviderService,
	PaginatedProviderServices,
} from "@/interface/provider-service.interface";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import apiService from "@/lib/api-service/api.service";
import { ApiResponse } from "@/interface/api.interface";
import { useTranslation } from "@/hooks/useTranslation";
import { ServiceCard } from "./_components/service-card";
import { Pagination } from "@/components/shared/pagination";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useThemeContext } from "@/components/context/theme-context";
import { ViewToggle, ViewMode } from "@/components/shared/view-toggle";
import { ServicesFilter, ServiceFilters } from "./_components/services-filter";
import { ServicesPageSkeleton } from "./_components/services-page-skeleton";
import { DataTable, DataTableColumn } from "@/components/shared/data-table";

interface ServicesPageProps {
	providerType: ProviderType;
}

export function ServicesPage({ providerType }: ServicesPageProps) {
	const { t } = useTranslation();
	const { sidebarState } = useThemeContext();
	const [services, setServices] = useState<ProviderService[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [filters, setFilters] = useState<ServiceFilters>({});
	const [allServiceTypes, setAllServiceTypes] = useState<string[]>([]);
	const [view, setView] = useState<ViewMode>("grid");
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 1,
		total: 0,
		totalPages: 0,
		hasMore: false,
	});

	// Calculate grid columns based on sidebar state
	const gridColumns = useMemo(() => {
		const isCollapsed = sidebarState === "collapsed";
		// When collapsed, we have more space, so show more columns
		// When expanded, we have less space, so show fewer columns
		if (isCollapsed) {
			return "grid-cols-4 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-lg:grid-cols-1";
		} else {
			return "grid-cols-3 max-2xl:grid-cols-2 max-lg:grid-cols-1";
		}
	}, [sidebarState]);

	// Fetch all available service types on mount (without filters)
	useEffect(() => {
		const fetchAllServiceTypes = async () => {
			try {
				const response: ApiResponse<PaginatedProviderServices> =
					await apiService.get(
						`/api/protected/services/${providerType}?page=1&limit=100`
					);

				if (response.success && response.data) {
					const types = new Set<string>();
					response.data.services.forEach((service) => {
						if (service.serviceType) {
							types.add(service.serviceType);
						}
					});
					setAllServiceTypes(Array.from(types).sort());
				}
			} catch (err) {
				// Silently fail - service types will be populated from filtered results
				console.error("Failed to fetch all service types:", err);
			}
		};

		fetchAllServiceTypes();
	}, [providerType]);

	const buildQueryString = useCallback(
		(
			currentPage: number,
			currentLimit: number,
			currentFilters: ServiceFilters
		) => {
			const params = new URLSearchParams();
			params.set("page", currentPage.toString());
			params.set("limit", currentLimit.toString());

			if (currentFilters.serviceType) {
				params.set("serviceType", currentFilters.serviceType);
			}

			if (
				currentFilters.isActive !== null &&
				currentFilters.isActive !== undefined
			) {
				params.set("isActive", currentFilters.isActive.toString());
			}

			if (
				currentFilters.isComingSoon !== null &&
				currentFilters.isComingSoon !== undefined
			) {
				params.set(
					"isComingSoon",
					currentFilters.isComingSoon.toString()
				);
			}

			return params.toString();
		},
		[]
	);

	const fetchServices = useCallback(
		async (
			currentPage: number,
			currentLimit: number,
			currentFilters: ServiceFilters
		) => {
			try {
				setLoading(true);
				setError(null);

				const queryString = buildQueryString(
					currentPage,
					currentLimit,
					currentFilters
				);

				const response: ApiResponse<PaginatedProviderServices> =
					await apiService.get(
						`/api/protected/services/${providerType}?${queryString}`
					);

				if (response.success && response.data) {
					setServices(response.data.services);
					setPagination(response.data.pagination);
				} else {
					setError(
						response.error ||
							response.message ||
							t("providers.services.fetchError")
					);
					toast.error(
						response.error ||
							response.message ||
							t("providers.services.fetchError")
					);
				}
			} catch (err: any) {
				const errorMessage =
					err.message || t("providers.services.fetchError");
				setError(errorMessage);
				toast.error(errorMessage);
			} finally {
				setLoading(false);
			}
		},
		[providerType, t, buildQueryString]
	);

	useEffect(() => {
		fetchServices(page, limit, filters);
	}, [page, limit, filters, fetchServices]);

	const handleFiltersChange = (newFilters: ServiceFilters) => {
		setFilters(newFilters);
		setPage(1); // Reset to page 1 when filters change
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setPage(newPage);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleLimitChange = (newLimit: number) => {
		// Reset to page 1 when limit changes
		setLimit(newLimit);
		setPage(1);
	};

	// Icon cell component
	const IconCell = ({
		imageUrl,
		name,
	}: {
		imageUrl: string | null;
		name: string;
	}) => {
		const [imageError, setImageError] = useState(false);
		return (
			<div className="flex items-center justify-center h-10 w-10">
				{imageUrl && !imageError ? (
					<img
						src={imageUrl}
						alt={name}
						className="h-8 w-8 object-contain"
						onError={() => setImageError(true)}
					/>
				) : (
					<Package className="h-8 w-8 text-muted-foreground" />
				)}
			</div>
		);
	};

	// Table columns configuration
	const tableColumns: DataTableColumn<ProviderService>[] = [
		{
			id: "icon",
			header: "",
			cell: (_, row) => (
				<IconCell imageUrl={row.imageUrl} name={row.name} />
			),
			width: "60px",
			minWidth: "60px",
		},
		{
			id: "name",
			header: t("providers.services.table.name"),
			accessorKey: "name",
			cell: (value) => (
				<div className="py-1">
					<Label className="font-medium">{value}</Label>
				</div>
			),
			sortable: true,
			filterable: true,
			minWidth: "180px",
		},
		{
			id: "description",
			header: t("providers.services.table.description"),
			accessorKey: "description",
			cell: (value) => (
				<div className="py-1">
					<Label className="text-sm text-muted-foreground line-clamp-2">
						{value}
					</Label>
				</div>
			),
			sortable: true,
			filterable: true,
			minWidth: "300px",
		},
		{
			id: "serviceType",
			header: t("providers.services.table.serviceType"),
			accessorKey: "serviceType",
			cell: (value) => (
				<div className="py-1">
					<Label className="text-sm">
						{String(value)
							.replace(/_/g, " ")
							.toLowerCase()
							.replace(/\b\w/g, (l) => l.toUpperCase())}
					</Label>
				</div>
			),
			sortable: true,
			filterable: true,
			minWidth: "180px",
		},
		{
			id: "status",
			header: t("providers.services.table.status"),
			cell: (_, row) => (
				<div className="flex items-center gap-2 flex-wrap py-1">
					{row.isComingSoon && (
						<Badge variant="secondary" className="text-xs">
							{t("providers.services.comingSoon")}
						</Badge>
					)}
					{!row.isActive && (
						<Badge variant="outline" className="text-xs">
							{t("providers.services.inactive")}
						</Badge>
					)}
					{row.isActive && !row.isComingSoon && (
						<Badge variant="default" className="text-xs">
							{t("providers.services.active")}
						</Badge>
					)}
				</div>
			),
			minWidth: "150px",
		},
	];

	if (loading && services.length === 0) {
		return <ServicesPageSkeleton />;
	}

	if (error && services.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4">
				<Label className="text-lg text-destructive">{error}</Label>
				<Button
					onClick={() => fetchServices(page, limit, filters)}
					variant="outline"
				>
					{t("providers.services.retry")}
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<Label className="text-2xl font-bold">
					{t("providers.services.title")} - {providerType}
				</Label>
				<Label className="text-muted-foreground">
					{t("providers.services.description")}
				</Label>
			</div>

			{/* Filters and View Toggle */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<ServicesFilter
					filters={filters}
					onFiltersChange={handleFiltersChange}
					serviceTypes={allServiceTypes}
				/>
				<ViewToggle view={view} onViewChange={setView} />
			</div>

			{/* Services Grid or Table */}
			{services.length === 0 ? (
				<div className="flex flex-col items-center justify-center space-y-4 py-12">
					<Label className="text-lg text-muted-foreground">
						{t("providers.services.noServices")}
					</Label>
				</div>
			) : view === "grid" ? (
				<div className={cn("grid gap-4", gridColumns)}>
					{services.map((service) => (
						<ServiceCard
							key={service.id}
							service={service}
							onClick={() => {
								// TODO: Navigate to service detail page
								// router.push(`/dashboard/providers/${providerType}/services/${service.id}`);
							}}
						/>
					))}
				</div>
			) : (
				<DataTable
					data={services}
					columns={tableColumns}
					enableColumnVisibility={true}
					enableExport={true}
					exportFileName={`${providerType}-services`}
					emptyStateTitle={t("providers.services.noServices")}
					emptyStateDescription={t(
						"providers.services.emptyStateDescription"
					)}
					onRowClick={(row) => {
						// TODO: Navigate to service detail page
						// router.push(`/dashboard/providers/${providerType}/services/${row.id}`);
					}}
				/>
			)}

			{/* Pagination */}
			<Pagination
				pagination={{
					...pagination,
					limit: limit,
				}}
				onPageChange={handlePageChange}
				onLimitChange={handleLimitChange}
			/>
		</div>
	);
}
