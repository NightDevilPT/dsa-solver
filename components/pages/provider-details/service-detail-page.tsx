"use client";

import { toast } from "sonner";
import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import apiService from "@/lib/api-service/api.service";
import { ApiResponse } from "@/interface/api.interface";
import { useTranslation } from "@/hooks/useTranslation";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { ServiceOverview } from "./_components/service-overview";
import { ProviderService } from "@/interface/provider-service.interface";
import { ServiceNotifications } from "./_components/service-notifications";
import { ServiceConfig } from "./_components/service-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ServiceDetailPageProps {
	providerType: ProviderType;
	providerId: string;
}

export function ServiceDetailPage({
	providerType,
	providerId,
}: ServiceDetailPageProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [service, setService] = useState<ProviderService | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Get active tab from query parameter, default to "overview"
	const activeTab = useMemo(() => {
		const tab = searchParams.get("tab");
		const validTabs = ["overview", "notifications", "config"];
		return tab && validTabs.includes(tab) ? tab : "overview";
	}, [searchParams]);

	// Handle tab change - update URL query parameter
	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", value);
		const queryString = params.toString();
		const newPath = `${pathname}?${queryString}`;
		router.push(newPath, { scroll: false });
	};

	useEffect(() => {
		const fetchService = async () => {
			try {
				setLoading(true);
				setError(null);

				const response: ApiResponse<ProviderService> =
					await apiService.get(
						`/api/protected/services/${providerType}/${providerId}`
					);

				console.log("Provider Service API Response:", response);

				if (response.success && response.data) {
					setService(response.data);
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
				console.error("Error fetching provider service:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchService();
	}, [providerType, providerId, t]);

	if (loading) {
		return (
			<div className="space-y-6">
				{/* Header Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-96" />
				</div>

				{/* Tabs Skeleton */}
				<div className="space-y-4">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
			</div>
		);
	}

	if (error || !service) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-12">
				<Label className="text-lg text-destructive">
					{error || t("providers.services.fetchError")}
				</Label>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList>
					<TabsTrigger value="overview">
						{t("providers.serviceDetail.tabs.overview")}
					</TabsTrigger>
					<TabsTrigger value="notifications">
						{t("providers.serviceDetail.tabs.notifications")}
					</TabsTrigger>
					<TabsTrigger value="config">
						{t("providers.serviceDetail.tabs.config")}
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="mt-4">
					<ServiceOverview service={service} />
				</TabsContent>

				{/* Notifications Tab */}
				<TabsContent value="notifications" className="mt-4">
					<ServiceNotifications service={service} />
				</TabsContent>

				{/* Service Config Tab */}
				<TabsContent value="config" className="mt-4">
					<ServiceConfig service={service} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
