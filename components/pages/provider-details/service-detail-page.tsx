"use client";

import {
	ServiceDetailTab,
	VALID_SERVICE_DETAIL_TABS,
} from "@/interface/provider-details.interface";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { ServiceConfig } from "./_components/service-config";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { ServiceOverview } from "./_components/service-overview";
import { ServiceNotifications } from "./_components/service-notifications";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceDetailPageSkeleton } from "./_components/service-detail-page-skeleton";
import { useProviderServiceContext } from "@/components/context/provider-service-context";

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
	const { serviceData, loading, error } = useProviderServiceContext();

	// Get active tab from query parameter, default to "overview"
	const activeTab = useMemo<ServiceDetailTab>(() => {
		const tab = searchParams.get("tab");
		return tab &&
			VALID_SERVICE_DETAIL_TABS.includes(tab as ServiceDetailTab)
			? (tab as ServiceDetailTab)
			: "overview";
	}, [searchParams]);

	// Handle tab change - update URL query parameter
	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", value);
		const queryString = params.toString();
		const newPath = `${pathname}?${queryString}`;
		router.push(newPath, { scroll: false });
	};

	if (loading) {
		return <ServiceDetailPageSkeleton />;
	}

	if (error || !serviceData) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-12">
				<Label className="text-lg text-destructive">
					{error || t("providers.services.fetchError")}
				</Label>
			</div>
		);
	}

	const { service, userProviderService, notificationConfig } = serviceData;

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
					<ServiceNotifications
						service={service}
						userProviderService={userProviderService}
						notificationConfig={notificationConfig}
					/>
				</TabsContent>

				{/* Service Config Tab */}
				<TabsContent value="config" className="mt-4">
					<ServiceConfig
						service={service}
						userProviderService={userProviderService}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
