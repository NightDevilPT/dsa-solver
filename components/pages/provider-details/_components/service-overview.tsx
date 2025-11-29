"use client";

import Image from "next/image";
import { useState } from "react";
import { Package } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { ProviderService } from "@/interface/provider-service.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceOverviewProps {
	service: ProviderService;
}

export function ServiceOverview({ service }: ServiceOverviewProps) {
	const { t } = useTranslation();
	const [imageError, setImageError] = useState(false);

	return (
		<div className="space-y-6">
			{/* Service Header */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 space-y-2">
							<div className="flex items-center gap-3">
								<CardTitle className="text-2xl">
									{service.name}
								</CardTitle>
								{service.isComingSoon && (
									<Badge
										variant="secondary"
										className="text-xs"
									>
										{t("providers.services.comingSoon")}
									</Badge>
								)}
								{!service.isActive && (
									<Badge
										variant="outline"
										className="text-xs"
									>
										{t("providers.services.inactive")}
									</Badge>
								)}
								{service.isActive && !service.isComingSoon && (
									<Badge
										variant="default"
										className="text-xs"
									>
										{t("providers.services.active")}
									</Badge>
								)}
							</div>
							<Label className="text-muted-foreground">
								{service.description}
							</Label>
						</div>
						<div className="h-16 w-16 shrink-0 flex items-center justify-center overflow-hidden rounded-md bg-muted/50">
							{service.imageUrl && !imageError ? (
								<Image
									src={service.imageUrl}
									alt={service.name}
									width={48}
									height={48}
									className="object-contain"
									onError={() => setImageError(true)}
								/>
							) : (
								<Package className="size-10 text-muted-foreground" />
							)}
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Service Details */}
			<Card>
				<CardHeader>
					<CardTitle>
						{t("providers.serviceDetail.overview.details")}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						{/* Provider Type */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{t(
									"providers.serviceDetail.details.providerType"
								)}
							</Label>
							<Label className="text-base">
								{service.providerType}
							</Label>
						</div>

						{/* Service Type */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{t(
									"providers.serviceDetail.details.serviceType"
								)}
							</Label>
							<Label className="text-base">
								{service.serviceType
									.replace(/_/g, " ")
									.toLowerCase()
									.replace(/\b\w/g, (l) => l.toUpperCase())}
							</Label>
						</div>

						{/* Status */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{t("providers.serviceDetail.details.status")}
							</Label>
							<div className="flex items-center gap-2">
								{service.isActive && !service.isComingSoon && (
									<Badge
										variant="default"
										className="text-xs"
									>
										{t("providers.services.active")}
									</Badge>
								)}
								{service.isComingSoon && (
									<Badge
										variant="secondary"
										className="text-xs"
									>
										{t("providers.services.comingSoon")}
									</Badge>
								)}
								{!service.isActive && (
									<Badge
										variant="outline"
										className="text-xs"
									>
										{t("providers.services.inactive")}
									</Badge>
								)}
							</div>
						</div>

						{/* Order */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{t("providers.serviceDetail.details.order")}
							</Label>
							<Label className="text-base">{service.order}</Label>
						</div>
					</div>

					<Separator />

					{/* Timestamps */}
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{t("providers.serviceDetail.details.createdAt")}
							</Label>
							<Label className="text-base">
								{new Date(
									service.createdAt
								).toLocaleDateString()}
							</Label>
						</div>

						<div className="space-y-1">
							<Label className="text-sm font-medium text-muted-foreground">
								{t("providers.serviceDetail.details.updatedAt")}
							</Label>
							<Label className="text-base">
								{new Date(
									service.updatedAt
								).toLocaleDateString()}
							</Label>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
