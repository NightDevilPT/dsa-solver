// Protected Provider Service Notification Config Update Endpoint
// PATCH /api/protected/services/[providerType]/[id]/notifications
// Updates or creates NotificationConfig for a UserProviderService

import {
	validateProviderServiceParams,
	validateUpdateNotificationConfig,
} from "@/lib/validation/provider-service.schema";
import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";
import { ProviderServiceWithUserData } from "@/interface/provider-details.interface";

const updateNotificationConfig = async (
	request: NextRequest,
	userId: string,
	params?: { providerType?: string; id?: string }
) => {
	try {
		// Validate route parameters
		const paramsValidation = validateProviderServiceParams({
			providerType: params?.providerType,
			id: params?.id,
		});

		if (!paramsValidation.success) {
			return NextResponse.json(
				{
					error: "Invalid route parameters",
					message:
						paramsValidation.error.issues[0]?.message ||
						"Validation failed",
				},
				{ status: 400 }
			);
		}

		const { providerType, id: serviceId } = paramsValidation.data;

		// Parse and validate request body
		const body = await request.json();
		const bodyValidation = validateUpdateNotificationConfig(body);

		if (!bodyValidation.success) {
			return NextResponse.json(
				{
					error: "Invalid request body",
					message:
						bodyValidation.error.issues[0]?.message ||
						"Validation failed",
				},
				{ status: 400 }
			);
		}

		const configData = bodyValidation.data;

		// Verify that the provider service exists
		const providerService = await prisma.providerService.findFirst({
			where: {
				id: serviceId,
				providerType: providerType,
			},
		});

		if (!providerService) {
			return NextResponse.json(
				{
					error: "Service not found",
					message: `Provider service with ID "${serviceId}" and provider type "${providerType}" not found`,
				},
				{ status: 404 }
			);
		}

		// Ensure UserProviderService exists (create if it doesn't)
		let userProviderService = await prisma.userProviderService.findUnique({
			where: {
				userId_providerServiceId: {
					userId: userId,
					providerServiceId: serviceId,
				},
			},
		});

		if (!userProviderService) {
			userProviderService = await prisma.userProviderService.create({
				data: {
					userId: userId,
					providerServiceId: serviceId,
					isEnabled: false,
				},
			});
		}

		// Note: Time format validation is handled by Zod schema
		// Note: emailFrequency and preferredTime relationship is validated by Zod schema

		// Check if this is a new config or update
		const existingConfig = await prisma.notificationConfig.findUnique({
			where: {
				userProviderServiceId: userProviderService.id,
			},
		});

		// Determine final emailFrequency value (use provided or existing or default)
		const finalEmailFrequency =
			configData.emailFrequency ??
			existingConfig?.emailFrequency ??
			"DAILY";

		// Validate preferredTime requirement for non-INSTANT frequencies
		if (finalEmailFrequency !== "INSTANT" && !configData.preferredTime) {
			// If updating and no preferredTime provided, check if existing config has one
			if (existingConfig?.preferredTime) {
				// Existing config has preferredTime, so it's okay to not provide it
			} else {
				// New config or existing config without preferredTime - must provide it
				return NextResponse.json(
					{
						error: "Missing required field",
						message:
							"preferredTime is required when emailFrequency is not INSTANT",
					},
					{ status: 400 }
				);
			}
		}

		// Upsert NotificationConfig
		const notificationConfig = await prisma.notificationConfig.upsert({
			where: {
				userProviderServiceId: userProviderService.id,
			},
			update: {
				...(configData.enabled !== undefined && {
					enabled: configData.enabled,
				}),
				...(configData.mailSubject !== undefined && {
					mailSubject: configData.mailSubject,
				}),
				...(configData.emailFrequency !== undefined && {
					emailFrequency: configData.emailFrequency,
				}),
				...(configData.preferredTime !== undefined && {
					preferredTime: configData.preferredTime,
				}),
				...(configData.includeBruteForce !== undefined && {
					includeBruteForce: configData.includeBruteForce,
				}),
				...(configData.includeOptimized !== undefined && {
					includeOptimized: configData.includeOptimized,
				}),
				...(configData.includeBestPractice !== undefined && {
					includeBestPractice: configData.includeBestPractice,
				}),
				...(configData.includeAlternative !== undefined && {
					includeAlternative: configData.includeAlternative,
				}),
				...(configData.includeExplanationOverview !== undefined && {
					includeExplanationOverview:
						configData.includeExplanationOverview,
				}),
				...(configData.includeExplanationApproach !== undefined && {
					includeExplanationApproach:
						configData.includeExplanationApproach,
				}),
				...(configData.includeStepByStep !== undefined && {
					includeStepByStep: configData.includeStepByStep,
				}),
				...(configData.includeKeyInsights !== undefined && {
					includeKeyInsights: configData.includeKeyInsights,
				}),
				...(configData.includeCommonMistakes !== undefined && {
					includeCommonMistakes: configData.includeCommonMistakes,
				}),
				...(configData.includeRelatedProblems !== undefined && {
					includeRelatedProblems: configData.includeRelatedProblems,
				}),
				...(configData.includeHintsProgressive !== undefined && {
					includeHintsProgressive: configData.includeHintsProgressive,
				}),
				...(configData.includeHintsApproach !== undefined && {
					includeHintsApproach: configData.includeHintsApproach,
				}),
				...(configData.includeHintsDataStructure !== undefined && {
					includeHintsDataStructure:
						configData.includeHintsDataStructure,
				}),
				...(configData.includeHintsAlgorithm !== undefined && {
					includeHintsAlgorithm: configData.includeHintsAlgorithm,
				}),
				...(configData.autoSubmit !== undefined && {
					autoSubmit: configData.autoSubmit,
				}),
				...(configData.autoSubmitTime !== undefined && {
					autoSubmitTime: configData.autoSubmitTime,
				}),
				...(configData.autoSubmitOnlyIfSolved !== undefined && {
					autoSubmitOnlyIfSolved: configData.autoSubmitOnlyIfSolved,
				}),
				...(configData.autoSubmitSendConfirmation !== undefined && {
					autoSubmitSendConfirmation:
						configData.autoSubmitSendConfirmation,
				}),
				...(configData.autoSubmitConfirmationSubject !== undefined && {
					autoSubmitConfirmationSubject:
						configData.autoSubmitConfirmationSubject,
				}),
				updatedAt: new Date(),
			},
			create: {
				userProviderServiceId: userProviderService.id,
				enabled: configData.enabled ?? false,
				mailSubject: configData.mailSubject ?? null,
				emailFrequency: configData.emailFrequency ?? "DAILY",
				preferredTime: configData.preferredTime ?? null,
				includeBruteForce: configData.includeBruteForce ?? false,
				includeOptimized: configData.includeOptimized ?? false,
				includeBestPractice: configData.includeBestPractice ?? false,
				includeAlternative: configData.includeAlternative ?? false,
				includeExplanationOverview:
					configData.includeExplanationOverview ?? false,
				includeExplanationApproach:
					configData.includeExplanationApproach ?? false,
				includeStepByStep: configData.includeStepByStep ?? false,
				includeKeyInsights: configData.includeKeyInsights ?? false,
				includeCommonMistakes:
					configData.includeCommonMistakes ?? false,
				includeRelatedProblems:
					configData.includeRelatedProblems ?? false,
				includeHintsProgressive:
					configData.includeHintsProgressive ?? false,
				includeHintsApproach: configData.includeHintsApproach ?? false,
				includeHintsDataStructure:
					configData.includeHintsDataStructure ?? false,
				includeHintsAlgorithm:
					configData.includeHintsAlgorithm ?? false,
				autoSubmit: configData.autoSubmit ?? false,
				autoSubmitTime: configData.autoSubmitTime ?? null,
				autoSubmitOnlyIfSolved:
					configData.autoSubmitOnlyIfSolved ?? true,
				autoSubmitSendConfirmation:
					configData.autoSubmitSendConfirmation ?? true,
				autoSubmitConfirmationSubject:
					configData.autoSubmitConfirmationSubject ?? null,
			},
		});

		// Fetch the updated provider service with relations
		const updatedService = await prisma.providerService.findFirst({
			where: {
				id: serviceId,
			},
			include: {
				userProviderServices: {
					where: {
						userId: userId,
					},
					include: {
						notificationConfig: true,
					},
					take: 1,
				},
			},
		});

		if (!updatedService) {
			return NextResponse.json(
				{
					error: "Failed to fetch updated service",
					message: "Service was updated but could not be retrieved",
				},
				{ status: 500 }
			);
		}

		// Format response data
		const updatedUserProviderService =
			updatedService.userProviderServices[0] || userProviderService;
		const updatedNotificationConfig =
			updatedUserProviderService.notificationConfig || notificationConfig;

		const responseData: ProviderServiceWithUserData = {
			service: {
				id: updatedService.id,
				name: updatedService.name,
				description: updatedService.description,
				imageUrl: updatedService.imageUrl,
				providerType: updatedService.providerType,
				serviceType: updatedService.serviceType,
				serviceConfigSchema: updatedService.serviceConfigSchema,
				order: updatedService.order,
				isActive: updatedService.isActive,
				isComingSoon: updatedService.isComingSoon,
				createdAt: updatedService.createdAt,
				updatedAt: updatedService.updatedAt,
			},
			userProviderService: {
				id: updatedUserProviderService.id,
				userId: updatedUserProviderService.userId,
				providerServiceId: updatedUserProviderService.providerServiceId,
				isEnabled: updatedUserProviderService.isEnabled,
				serviceConfig:
					updatedUserProviderService.serviceConfig as Record<
						string,
						any
					> | null,
				createdAt: updatedUserProviderService.createdAt,
				updatedAt: updatedUserProviderService.updatedAt,
			},
			notificationConfig: updatedNotificationConfig
				? {
						id: updatedNotificationConfig.id,
						userProviderServiceId:
							updatedNotificationConfig.userProviderServiceId,
						enabled: updatedNotificationConfig.enabled,
						mailSubject: updatedNotificationConfig.mailSubject,
						emailFrequency:
							updatedNotificationConfig.emailFrequency,
						preferredTime: updatedNotificationConfig.preferredTime,
						includeBruteForce:
							updatedNotificationConfig.includeBruteForce,
						includeOptimized:
							updatedNotificationConfig.includeOptimized,
						includeBestPractice:
							updatedNotificationConfig.includeBestPractice,
						includeAlternative:
							updatedNotificationConfig.includeAlternative,
						includeExplanationOverview:
							updatedNotificationConfig.includeExplanationOverview,
						includeExplanationApproach:
							updatedNotificationConfig.includeExplanationApproach,
						includeStepByStep:
							updatedNotificationConfig.includeStepByStep,
						includeKeyInsights:
							updatedNotificationConfig.includeKeyInsights,
						includeCommonMistakes:
							updatedNotificationConfig.includeCommonMistakes,
						includeRelatedProblems:
							updatedNotificationConfig.includeRelatedProblems,
						includeHintsProgressive:
							updatedNotificationConfig.includeHintsProgressive,
						includeHintsApproach:
							updatedNotificationConfig.includeHintsApproach,
						includeHintsDataStructure:
							updatedNotificationConfig.includeHintsDataStructure,
						includeHintsAlgorithm:
							updatedNotificationConfig.includeHintsAlgorithm,
						autoSubmit: updatedNotificationConfig.autoSubmit,
						autoSubmitTime:
							updatedNotificationConfig.autoSubmitTime,
						autoSubmitOnlyIfSolved:
							updatedNotificationConfig.autoSubmitOnlyIfSolved,
						autoSubmitSendConfirmation:
							updatedNotificationConfig.autoSubmitSendConfirmation,
						autoSubmitConfirmationSubject:
							updatedNotificationConfig.autoSubmitConfirmationSubject,
						createdAt: updatedNotificationConfig.createdAt,
						updatedAt: updatedNotificationConfig.updatedAt,
				  }
				: null,
		};

		return NextResponse.json({
			data: responseData,
			message: "Notification configuration updated successfully",
		});
	} catch (error: any) {
		console.error("Error updating notification config:", error);
		return NextResponse.json(
			{
				error: "Failed to update notification configuration",
				message:
					error.message ||
					"An error occurred while updating the notification configuration",
			},
			{ status: 500 }
		);
	}
};

export const PATCH = protectedRoute(updateNotificationConfig);
