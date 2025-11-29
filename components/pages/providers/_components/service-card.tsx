"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Package } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { ProviderService } from "@/interface/provider-service.interface";

interface ServiceCardProps {
	service: ProviderService;
	onClick?: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
	const { t } = useTranslation();
	const [imageError, setImageError] = useState(false);

	return (
		<Card
			className={cn(
				"cursor-pointer transition-all hover:shadow-md hover:border-primary/50 overflow-hidden",
				onClick && "hover:scale-[1.02]"
			)}
			onClick={onClick}
		>
			<CardHeader>
				<div className="flex items-start justify-between gap-3 min-w-0">
					<div className="flex-1 min-w-0 space-y-2">
						<div className="flex items-center gap-2 flex-wrap">
							<CardTitle className="text-lg truncate">
								{service.name}
							</CardTitle>
							{service.isComingSoon && (
								<Badge
									variant="secondary"
									className="text-xs shrink-0"
								>
									{t("providers.services.comingSoon")}
								</Badge>
							)}
							{!service.isActive && (
								<Badge
									variant="outline"
									className="text-xs shrink-0"
								>
									{t("providers.services.inactive")}
								</Badge>
							)}
						</div>
						<CardDescription className="line-clamp-2">
							{service.description}
						</CardDescription>
					</div>
					<div className="h-12 w-12 shrink-0 flex items-center justify-center overflow-hidden rounded-md bg-muted/50">
						{service.imageUrl && !imageError ? (
							<Image
								src={service.imageUrl}
								alt={service.name}
								width={32}
								height={32}
								className="object-contain"
								onError={() => setImageError(true)}
							/>
						) : (
							<Package className="size-8 text-muted-foreground" />
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<Label className="text-xs text-muted-foreground">
						{t("providers.services.serviceType")}:{" "}
						{service.serviceType.replace(/_/g, " ")}
					</Label>
					{service.isActive && !service.isComingSoon && (
						<Badge variant="default" className="text-xs">
							{t("providers.services.active")}
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
