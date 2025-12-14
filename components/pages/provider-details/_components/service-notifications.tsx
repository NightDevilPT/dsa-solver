"use client";

import {
	ConfigToggle,
	ConfigInput,
	ConfigSelect,
} from "./config-field-components";
import {
	ServiceNotificationsProps,
	NotificationConfig,
} from "@/interface/provider-details.interface";
import { Save } from "lucide-react";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProviderServiceContext } from "@/components/context/provider-service-context";

// Using shared components from config-field-components.tsx

export function ServiceNotifications({
	service,
	userProviderService,
	notificationConfig: initialNotificationConfig,
}: ServiceNotificationsProps) {
	const { t } = useTranslation();
	const { updateNotificationConfig, loading: contextLoading } =
		useProviderServiceContext();
	const [notificationConfig, setNotificationConfig] =
		useState<NotificationConfig | null>(initialNotificationConfig || null);
	const [saving, setSaving] = useState(false);

	// Check if service is DAILY_CHALLENGE
	const isDailyChallenge = service.serviceType === "DAILY_CHALLENGE";

	// Initialize default config if no user relation exists
	const defaultConfig: NotificationConfig = useMemo(
		() => ({
			id: "",
			userProviderServiceId: userProviderService?.id || "",
			enabled: false,
			mailSubject: "DSA Solver " + service.name + " Notification",
			emailFrequency: "DAILY",
			preferredTime: isDailyChallenge ? "09:00" : "09:00",
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
			autoSubmitTime: "09:00",
			autoSubmitOnlyIfSolved: false,
			autoSubmitSendConfirmation: false,
			autoSubmitConfirmationSubject: "Solution Submitted: {problemTitle}",
			createdAt: new Date(),
			updatedAt: new Date(),
		}),
		[userProviderService, isDailyChallenge, service.name]
	);

	// Update local state when prop changes
	useMemo(() => {
		if (initialNotificationConfig) {
			// Merge with defaults to ensure all fields have values
			const emailFreq = isDailyChallenge
				? "DAILY"
				: initialNotificationConfig.emailFrequency ||
				  defaultConfig.emailFrequency;
			const shouldHavePreferredTime = emailFreq !== "INSTANT";

			const mergedConfig: NotificationConfig = {
				...defaultConfig,
				...initialNotificationConfig,
				// For DAILY_CHALLENGE, ensure emailFrequency is DAILY and preferredTime is set
				emailFrequency: emailFreq,
				preferredTime: isDailyChallenge
					? initialNotificationConfig.preferredTime || "09:00"
					: shouldHavePreferredTime
					? initialNotificationConfig.preferredTime ||
					  defaultConfig.preferredTime
					: null,
				// Ensure string fields have defaults
				mailSubject:
					initialNotificationConfig.mailSubject ||
					defaultConfig.mailSubject,
				autoSubmitTime:
					initialNotificationConfig.autoSubmitTime ||
					defaultConfig.autoSubmitTime,
				autoSubmitConfirmationSubject:
					initialNotificationConfig.autoSubmitConfirmationSubject ||
					defaultConfig.autoSubmitConfirmationSubject,
			};
			setNotificationConfig(mergedConfig);
		} else {
			setNotificationConfig(null);
		}
	}, [initialNotificationConfig, isDailyChallenge, defaultConfig]);

	// Merge config with defaults to ensure all fields have values
	const config: NotificationConfig = useMemo(() => {
		if (!notificationConfig) return defaultConfig;

		const emailFreq =
			notificationConfig.emailFrequency || defaultConfig.emailFrequency;
		const shouldHavePreferredTime = emailFreq !== "INSTANT";

		return {
			...defaultConfig,
			...notificationConfig,
			// Ensure string/time fields have defaults
			mailSubject:
				notificationConfig.mailSubject || defaultConfig.mailSubject,
			preferredTime: shouldHavePreferredTime
				? notificationConfig.preferredTime ||
				  defaultConfig.preferredTime
				: null,
			autoSubmitTime:
				notificationConfig.autoSubmitTime ||
				defaultConfig.autoSubmitTime,
			autoSubmitConfirmationSubject:
				notificationConfig.autoSubmitConfirmationSubject ||
				defaultConfig.autoSubmitConfirmationSubject,
		};
	}, [notificationConfig, defaultConfig]);
	const hasUserRelation = !!userProviderService;
	const isDisabled = saving || contextLoading;

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
			});
		}
	};

	const handleInputChange = (
		field: keyof NotificationConfig,
		value: string | null
	) => {
		if (isDisabled) return;

		// For DAILY_CHALLENGE, prevent changing emailFrequency
		if (field === "emailFrequency" && isDailyChallenge) {
			return; // Don't allow changes for DAILY_CHALLENGE
		}

		// If emailFrequency is changed to INSTANT, set preferredTime to null
		if (field === "emailFrequency" && value === "INSTANT") {
			// Optimistic update
			if (notificationConfig) {
				setNotificationConfig((prev) => {
					if (!prev) return null;
					return { ...prev, [field]: value, preferredTime: null };
				});
			} else {
				// If no config exists, create a new one with the updated value
				setNotificationConfig({
					...defaultConfig,
					[field]: value,
					preferredTime: null,
				});
			}
		} else {
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
				});
			}
		}
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			const currentConfig = notificationConfig || defaultConfig;
			// For DAILY_CHALLENGE, ensure emailFrequency is DAILY and preferredTime is set
			const finalEmailFrequency = isDailyChallenge
				? "DAILY"
				: currentConfig.emailFrequency;
			const finalPreferredTime = isDailyChallenge
				? currentConfig.preferredTime || "09:00"
				: currentConfig.emailFrequency === "INSTANT"
				? null
				: currentConfig.preferredTime || "09:00";
			await updateNotificationConfig({
				enabled: currentConfig.enabled,
				mailSubject: currentConfig.mailSubject,
				emailFrequency: finalEmailFrequency,
				preferredTime: finalPreferredTime,
				includeBruteForce: currentConfig.includeBruteForce,
				includeOptimized: currentConfig.includeOptimized,
				includeBestPractice: currentConfig.includeBestPractice,
				includeAlternative: currentConfig.includeAlternative,
				includeExplanationOverview:
					currentConfig.includeExplanationOverview,
				includeExplanationApproach:
					currentConfig.includeExplanationApproach,
				includeStepByStep: currentConfig.includeStepByStep,
				includeKeyInsights: currentConfig.includeKeyInsights,
				includeCommonMistakes: currentConfig.includeCommonMistakes,
				includeRelatedProblems: currentConfig.includeRelatedProblems,
				includeHintsProgressive: currentConfig.includeHintsProgressive,
				includeHintsApproach: currentConfig.includeHintsApproach,
				includeHintsDataStructure:
					currentConfig.includeHintsDataStructure,
				includeHintsAlgorithm: currentConfig.includeHintsAlgorithm,
				autoSubmit: currentConfig.autoSubmit,
				autoSubmitTime: currentConfig.autoSubmitTime,
				autoSubmitOnlyIfSolved: currentConfig.autoSubmitOnlyIfSolved,
				autoSubmitSendConfirmation:
					currentConfig.autoSubmitSendConfirmation,
				autoSubmitConfirmationSubject:
					currentConfig.autoSubmitConfirmationSubject,
			});
		} catch (error: any) {
			console.error("Error saving notification config:", error);
		} finally {
			setSaving(false);
		}
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

	if (contextLoading) {
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
					<CardContent className="">
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

					{/* Email Frequency Select */}
					<ConfigSelect
						title={t(
							"providers.serviceDetail.notifications.emailFrequency"
						)}
						description={t(
							"providers.serviceDetail.notifications.emailFrequencyDescription"
						)}
						value={config.emailFrequency}
						onChange={(value) =>
							handleInputChange("emailFrequency", value)
						}
						options={[
							{
								value: "INSTANT",
								label: t(
									"providers.serviceDetail.notifications.emailFrequencyInstant"
								),
							},
							{
								value: "DAILY",
								label: t(
									"providers.serviceDetail.notifications.emailFrequencyDaily"
								),
							},
							{
								value: "WEEKLY",
								label: t(
									"providers.serviceDetail.notifications.emailFrequencyWeekly"
								),
							},
						]}
						disabled={isDisabled || isDailyChallenge}
					/>

					{/* Preferred Time Input - Only show when emailFrequency is not INSTANT */}
					{config.emailFrequency !== "INSTANT" && (
						<ConfigInput
							title={t(
								"providers.serviceDetail.notifications.preferredTime"
							)}
							description={t(
								"providers.serviceDetail.notifications.preferredTimeDescription"
							)}
							value={config.preferredTime || "09:00"}
							onChange={(value) =>
								handleInputChange(
									"preferredTime",
									value || null
								)
							}
							type="time"
							placeholder="09:00"
							disabled={isDisabled}
						/>
					)}

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
