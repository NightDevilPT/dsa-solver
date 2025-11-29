"use client";

import { ConfigToggle, ConfigInput } from "./config-field-components";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect, useCallback } from "react";
import { ProviderService } from "@/interface/provider-service.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationConfig {
	id: string;
	userProviderServiceId: string;
	enabled: boolean;
	mailSubject: string | null;
	emailFrequency: string;
	preferredTime: string | null;
	includeBruteForce: boolean;
	includeOptimized: boolean;
	includeBestPractice: boolean;
	includeAlternative: boolean;
	includeExplanationOverview: boolean;
	includeExplanationApproach: boolean;
	includeStepByStep: boolean;
	includeKeyInsights: boolean;
	includeCommonMistakes: boolean;
	includeRelatedProblems: boolean;
	includeHintsProgressive: boolean;
	includeHintsApproach: boolean;
	includeHintsDataStructure: boolean;
	includeHintsAlgorithm: boolean;
	autoSubmit: boolean;
	autoSubmitTime: string | null;
	autoSubmitOnlyIfSolved: boolean;
	autoSubmitSendConfirmation: boolean;
	autoSubmitConfirmationSubject: string | null;
	createdAt: Date;
	updatedAt: Date;
}

interface ServiceNotificationsProps {
	service: ProviderService;
}

// Using shared components from config-field-components.tsx

export function ServiceNotifications({ service }: ServiceNotificationsProps) {
	const { t } = useTranslation();
	const [notificationConfig, setNotificationConfig] =
		useState<NotificationConfig | null>(null);
	const [loading, setLoading] = useState(true);
	const [hasUserRelation, setHasUserRelation] = useState(false);
	const [userProviderServiceId, setUserProviderServiceId] = useState<
		string | null
	>(null);

	// TODO: Fetch user provider service relation
	// This function will be implemented in the future
	// const fetchUserProviderService = async () => {
	// 	try {
	// 		const response: ApiResponse<{
	// 			id: string;
	// 			providerServiceId: string;
	// 			isEnabled: boolean;
	// 		}> = await apiService.get(
	// 			`/api/protected/user-provider-services?providerServiceId=${service.id}`
	// 		);
	// 		if (response.success && response.data) {
	// 			setHasUserRelation(true);
	// 			setUserProviderServiceId(response.data.id);
	// 			return response.data.id;
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching user provider service:", error);
	// 	}
	// 	return null;
	// };

	// TODO: Fetch notification config from API
	// This function will be implemented in the future
	// const fetchNotificationConfig = async (userProviderServiceId: string) => {
	// 	try {
	// 		const response: ApiResponse<NotificationConfig> = await apiService.get(
	// 			`/api/protected/user-provider-services/${userProviderServiceId}/notifications`
	// 		);
	// 		if (response.success && response.data) {
	// 			setNotificationConfig(response.data);
	// 			return response.data;
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching notification config:", error);
	// 	}
	// 	return null;
	// };

	// TODO: Update notification config
	// This function will be implemented in the future
	// const updateNotificationConfig = async (
	// 	field: keyof NotificationConfig,
	// 	value: any
	// ) => {
	// 	if (!userProviderServiceId) return;
	// 	try {
	// 		const response: ApiResponse<NotificationConfig> = await apiService.patch(
	// 			`/api/protected/user-provider-services/${userProviderServiceId}/notifications`,
	// 			{ [field]: value }
	// 		);
	// 		if (response.success && response.data) {
	// 			setNotificationConfig(response.data);
	// 			toast.success(t("providers.serviceDetail.notifications.updateSuccess"));
	// 		}
	// 	} catch (error: any) {
	// 		console.error("Error updating notification config:", error);
	// 		toast.error(
	// 			error.message ||
	// 				t("providers.serviceDetail.notifications.updateError")
	// 		);
	// 	}
	// };

	// Fetch user provider service relation and notification config
	const fetchData = useCallback(async () => {
		try {
			setLoading(true);

			// TODO: Uncomment when API is ready
			// const upsId = await fetchUserProviderService();
			// if (upsId) {
			// 	await fetchNotificationConfig(upsId);
			// } else {
			// 	setHasUserRelation(false);
			// 	setNotificationConfig(null);
			// }

			// For now, simulate no relation
			setHasUserRelation(false);
			setNotificationConfig(null);
		} catch (error) {
			console.error("Error fetching data:", error);
			setHasUserRelation(false);
			setNotificationConfig(null);
		} finally {
			setLoading(false);
		}
	}, [service.id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Initialize default config if no user relation exists
	const defaultConfig: NotificationConfig = {
		id: "",
		userProviderServiceId: "",
		enabled: false,
		mailSubject: null,
		emailFrequency: "DAILY",
		preferredTime: null,
		includeBruteForce: false,
		includeOptimized: false,
		includeBestPractice: false,
		includeAlternative: false,
		includeExplanationOverview: false,
		includeExplanationApproach: false,
		includeStepByStep: false,
		includeKeyInsights: false,
		includeCommonMistakes: false,
		includeRelatedProblems: false,
		includeHintsProgressive: false,
		includeHintsApproach: false,
		includeHintsDataStructure: false,
		includeHintsAlgorithm: false,
		autoSubmit: false,
		autoSubmitTime: null,
		autoSubmitOnlyIfSolved: true,
		autoSubmitSendConfirmation: true,
		autoSubmitConfirmationSubject: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const config = notificationConfig || defaultConfig;
	const isDisabled = loading; // Only disable during loading

	const handleToggle = (field: keyof NotificationConfig, value: boolean) => {
		if (isDisabled) return;

		// Optimistic update
		if (notificationConfig) {
			setNotificationConfig((prev) => {
				if (!prev) return null;
				return { ...prev, [field]: value };
			});
		} else {
			// If no config exists, create a new one with the updated value
			setNotificationConfig({
				...defaultConfig,
				[field]: value,
				userProviderServiceId: userProviderServiceId || "",
			});
		}

		// TODO: Uncomment when API is ready
		// updateNotificationConfig(field, value);
	};

	const handleInputChange = (
		field: keyof NotificationConfig,
		value: string | null
	) => {
		if (isDisabled) return;

		// Optimistic update
		if (notificationConfig) {
			setNotificationConfig((prev) => {
				if (!prev) return null;
				return { ...prev, [field]: value };
			});
		} else {
			// If no config exists, create a new one with the updated value
			setNotificationConfig({
				...defaultConfig,
				[field]: value,
				userProviderServiceId: userProviderServiceId || "",
			});
		}

		// TODO: Uncomment when API is ready
		// updateNotificationConfig(field, value);
	};

	const handleSave = () => {
		const currentConfig = notificationConfig || defaultConfig;
		console.log("Notification Configuration State:", {
			...currentConfig,
			hasUserRelation,
			userProviderServiceId,
		});
		toast.success(t("providers.serviceDetail.notifications.saveSuccess"));
	};

	// Define notification toggle configurations
	const notificationToggles = [
		{
			section: "emailConfig",
			sectionTitle: t(
				"providers.serviceDetail.notifications.emailConfig"
			),
			toggles: [
				{
					field: "enabled" as keyof NotificationConfig,
					title: t("providers.serviceDetail.notifications.enabled"),
					description: t(
						"providers.serviceDetail.notifications.enabledDescription"
					),
				},
			],
		},
		{
			section: "solutionsConfig",
			sectionTitle: t(
				"providers.serviceDetail.notifications.solutionsConfig"
			),
			toggles: [
				{
					field: "includeBruteForce" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeBruteForce"
					),
					description: t(
						"providers.serviceDetail.notifications.includeBruteForceDescription"
					),
				},
				{
					field: "includeOptimized" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeOptimized"
					),
					description: t(
						"providers.serviceDetail.notifications.includeOptimizedDescription"
					),
				},
				{
					field: "includeBestPractice" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeBestPractice"
					),
					description: t(
						"providers.serviceDetail.notifications.includeBestPracticeDescription"
					),
				},
				{
					field: "includeAlternative" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeAlternative"
					),
					description: t(
						"providers.serviceDetail.notifications.includeAlternativeDescription"
					),
				},
			],
		},
		{
			section: "explanationsConfig",
			sectionTitle: t(
				"providers.serviceDetail.notifications.explanationsConfig"
			),
			toggles: [
				{
					field: "includeExplanationOverview" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeExplanationOverview"
					),
					description: t(
						"providers.serviceDetail.notifications.includeExplanationOverviewDescription"
					),
				},
				{
					field: "includeExplanationApproach" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeExplanationApproach"
					),
					description: t(
						"providers.serviceDetail.notifications.includeExplanationApproachDescription"
					),
				},
				{
					field: "includeStepByStep" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeStepByStep"
					),
					description: t(
						"providers.serviceDetail.notifications.includeStepByStepDescription"
					),
				},
				{
					field: "includeKeyInsights" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeKeyInsights"
					),
					description: t(
						"providers.serviceDetail.notifications.includeKeyInsightsDescription"
					),
				},
				{
					field: "includeCommonMistakes" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeCommonMistakes"
					),
					description: t(
						"providers.serviceDetail.notifications.includeCommonMistakesDescription"
					),
				},
				{
					field: "includeRelatedProblems" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeRelatedProblems"
					),
					description: t(
						"providers.serviceDetail.notifications.includeRelatedProblemsDescription"
					),
				},
			],
		},
		{
			section: "hintsConfig",
			sectionTitle: t(
				"providers.serviceDetail.notifications.hintsConfig"
			),
			toggles: [
				{
					field: "includeHintsProgressive" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeHintsProgressive"
					),
					description: t(
						"providers.serviceDetail.notifications.includeHintsProgressiveDescription"
					),
				},
				{
					field: "includeHintsApproach" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeHintsApproach"
					),
					description: t(
						"providers.serviceDetail.notifications.includeHintsApproachDescription"
					),
				},
				{
					field: "includeHintsDataStructure" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeHintsDataStructure"
					),
					description: t(
						"providers.serviceDetail.notifications.includeHintsDataStructureDescription"
					),
				},
				{
					field: "includeHintsAlgorithm" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.includeHintsAlgorithm"
					),
					description: t(
						"providers.serviceDetail.notifications.includeHintsAlgorithmDescription"
					),
				},
			],
		},
		{
			section: "autoSubmitConfig",
			sectionTitle: t(
				"providers.serviceDetail.notifications.autoSubmitConfig"
			),
			toggles: [
				{
					field: "autoSubmit" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.autoSubmit"
					),
					description: t(
						"providers.serviceDetail.notifications.autoSubmitDescription"
					),
				},
				{
					field: "autoSubmitOnlyIfSolved" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.autoSubmitOnlyIfSolved"
					),
					description: t(
						"providers.serviceDetail.notifications.autoSubmitOnlyIfSolvedDescription"
					),
				},
				{
					field: "autoSubmitSendConfirmation" as keyof NotificationConfig,
					title: t(
						"providers.serviceDetail.notifications.autoSubmitSendConfirmation"
					),
					description: t(
						"providers.serviceDetail.notifications.autoSubmitSendConfirmationDescription"
					),
				},
			],
		},
	];

	if (loading) {
		return (
			<div className="space-y-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							{Array.from({ length: 3 }).map((_, j) => (
								<Skeleton key={j} className="h-20 w-full" />
							))}
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Save Button */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<Label className="text-2xl font-bold">
						{t("providers.serviceDetail.tabs.notifications")}
					</Label>
					<Label className="text-sm text-muted-foreground">
						{t(
							"providers.serviceDetail.notifications.pageDescription"
						)}
					</Label>
				</div>
				<Button
					onClick={handleSave}
					disabled={isDisabled}
					className="gap-2"
					size="lg"
				>
					<Save className="size-4" />
					<Label>
						{t("providers.serviceDetail.notifications.saveButton")}
					</Label>
				</Button>
			</div>

			{/* Info Banner */}
			{!hasUserRelation && (
				<Card className="border-primary/20 bg-primary/5 shadow-sm">
					<CardContent className="pt-4 pb-4">
						<div className="flex items-start gap-3">
							<div className="flex-1 space-y-1">
								<Label className="text-sm font-semibold text-foreground">
									{t(
										"providers.serviceDetail.notifications.noRelationTitle"
									)}
								</Label>
								<Label className="text-xs text-muted-foreground block leading-relaxed">
									{t(
										"providers.serviceDetail.notifications.noRelationMessage"
									)}
								</Label>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Email Configuration with Mail Subject and Preferred Language */}
			<Card className="border-border/50 shadow-sm">
				<CardHeader className="pb-4 border-b">
					<CardTitle className="text-lg font-semibold">
						{t("providers.serviceDetail.notifications.emailConfig")}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Enabled Toggle */}
					<ConfigToggle
						title={t(
							"providers.serviceDetail.notifications.enabled"
						)}
						description={t(
							"providers.serviceDetail.notifications.enabledDescription"
						)}
						checked={config.enabled}
						onCheckedChange={(checked) =>
							handleToggle("enabled", checked)
						}
						disabled={isDisabled}
					/>

					{/* Mail Subject Input */}
					<ConfigInput
						title={t(
							"providers.serviceDetail.notifications.mailSubject"
						)}
						description={t(
							"providers.serviceDetail.notifications.mailSubjectDescription"
						)}
						value={config.mailSubject || ""}
						onChange={(value) =>
							handleInputChange("mailSubject", value || null)
						}
						placeholder={t(
							"providers.serviceDetail.notifications.mailSubjectPlaceholder"
						)}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>

			{/* Notification Sections */}
			{notificationToggles
				.filter((section) => section.section !== "emailConfig")
				.map((section) => (
					<Card
						key={section.section}
						className="border-border/50 shadow-sm"
					>
						<CardHeader className="pb-4 border-b">
							<CardTitle className="text-lg font-semibold">
								{section.sectionTitle}
							</CardTitle>
						</CardHeader>
						<CardContent className="">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{section.toggles.map((toggle) => (
									<ConfigToggle
										key={toggle.field}
										title={toggle.title}
										description={toggle.description}
										checked={
											config[toggle.field] as boolean
										}
										onCheckedChange={(checked) =>
											handleToggle(toggle.field, checked)
										}
										disabled={isDisabled}
									/>
								))}
							</div>
						</CardContent>
					</Card>
				))}
		</div>
	);
}
