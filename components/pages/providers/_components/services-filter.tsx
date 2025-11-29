"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";

export interface ServiceFilters {
	serviceType?: string;
	isActive?: boolean | null;
	isComingSoon?: boolean | null;
}

interface ServicesFilterProps {
	filters: ServiceFilters;
	onFiltersChange: (filters: ServiceFilters) => void;
	serviceTypes: string[];
	className?: string;
}

export function ServicesFilter({
	filters,
	onFiltersChange,
	serviceTypes,
	className,
}: ServicesFilterProps) {
	const { t } = useTranslation();

	const handleServiceTypeChange = (value: string) => {
		onFiltersChange({
			...filters,
			serviceType: value === "all" ? undefined : value,
		});
	};

	const handleStatusChange = (value: string) => {
		let isActive: boolean | null = null;
		let isComingSoon: boolean | null = null;

		if (value === "active") {
			isActive = true;
			isComingSoon = false;
		} else if (value === "coming-soon") {
			isActive = false;
			isComingSoon = true;
		} else if (value === "inactive") {
			isActive = false;
			isComingSoon = false;
		} else {
			isActive = null;
			isComingSoon = null;
		}

		onFiltersChange({
			...filters,
			isActive,
			isComingSoon,
		});
	};

	return (
		<div className={cn("flex flex-wrap items-center gap-4", className)}>
			{/* Service Type Filter */}
			<div className="flex items-center gap-2">
				<Label className="text-sm whitespace-nowrap">
					{t("providers.services.filters.serviceType")}:
				</Label>
				<Select
					value={filters.serviceType || "all"}
					onValueChange={handleServiceTypeChange}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							{t("providers.services.filters.allTypes")}
						</SelectItem>
						{/* Always show all service types */}
						{serviceTypes.map((type) => (
							<SelectItem key={type} value={type}>
								{type
									.replace(/_/g, " ")
									.toLowerCase()
									.replace(/\b\w/g, (l) => l.toUpperCase())}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Status Filter */}
			<div className="flex items-center gap-2">
				<Label className="text-sm whitespace-nowrap">
					{t("providers.services.filters.status")}:
				</Label>
				<Select
					value={
						filters.isActive === true &&
						filters.isComingSoon === false
							? "active"
							: filters.isActive === false &&
							  filters.isComingSoon === true
							? "coming-soon"
							: filters.isActive === false &&
							  filters.isComingSoon === false
							? "inactive"
							: "all"
					}
					onValueChange={handleStatusChange}
				>
					<SelectTrigger className="w-[150px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							{t("providers.services.filters.allStatus")}
						</SelectItem>
						<SelectItem value="active">
							{t("providers.services.filters.active")}
						</SelectItem>
						<SelectItem value="coming-soon">
							{t("providers.services.filters.comingSoon")}
						</SelectItem>
						<SelectItem value="inactive">
							{t("providers.services.filters.inactive")}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
