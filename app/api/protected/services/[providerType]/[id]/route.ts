// Protected Provider Service by ID Endpoint
// GET /api/protected/services/[providerType]/[id]
// Returns a single provider service by ID and provider type with user data

import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";
import { ProviderServiceWithUserData } from "@/interface/provider-details.interface";
import { validateProviderServiceParams } from "@/lib/validation/provider-service.schema";

const getProviderServiceById = async (
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
					message: paramsValidation.error.issues[0]?.message || "Validation failed",
				},
				{ status: 400 }
			);
		}

		const { providerType, id: serviceId } = paramsValidation.data;

		// Find the provider service by ID and providerType with user relations
		const service = await prisma.providerService.findFirst({
			where: {
				id: serviceId,
				providerType: providerType,
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

		// Check if service exists
		if (!service) {
			return NextResponse.json(
				{
					error: "Service not found",
					message: `Provider service with ID "${serviceId}" and provider type "${providerType}" not found`,
				},
				{ status: 404 }
			);
		}

		// Extract user provider service and notification config
		const userProviderService =
			service.userProviderServices.length > 0
				? service.userProviderServices[0]
				: null;

		const notificationConfig = userProviderService?.notificationConfig || null;

		// Format response data
		const responseData: ProviderServiceWithUserData = {
			service: {
				id: service.id,
				name: service.name,
				description: service.description,
				imageUrl: service.imageUrl,
				providerType: service.providerType,
				serviceType: service.serviceType,
				serviceConfigSchema: service.serviceConfigSchema,
				order: service.order,
				isActive: service.isActive,
				isComingSoon: service.isComingSoon,
				createdAt: service.createdAt,
				updatedAt: service.updatedAt,
			},
			userProviderService: userProviderService
				? {
						id: userProviderService.id,
						userId: userProviderService.userId,
						providerServiceId: userProviderService.providerServiceId,
						isEnabled: userProviderService.isEnabled,
						serviceConfig:
							userProviderService.serviceConfig as Record<
								string,
								any
							> | null,
						createdAt: userProviderService.createdAt,
						updatedAt: userProviderService.updatedAt,
				  }
				: null,
			notificationConfig: notificationConfig
				? {
						id: notificationConfig.id,
						userProviderServiceId:
							notificationConfig.userProviderServiceId,
						enabled: notificationConfig.enabled,
						mailSubject: notificationConfig.mailSubject,
						emailFrequency: notificationConfig.emailFrequency,
						preferredTime: notificationConfig.preferredTime,
						includeBruteForce: notificationConfig.includeBruteForce,
						includeOptimized: notificationConfig.includeOptimized,
						includeBestPractice:
							notificationConfig.includeBestPractice,
						includeAlternative: notificationConfig.includeAlternative,
						includeExplanationOverview:
							notificationConfig.includeExplanationOverview,
						includeExplanationApproach:
							notificationConfig.includeExplanationApproach,
						includeStepByStep: notificationConfig.includeStepByStep,
						includeKeyInsights: notificationConfig.includeKeyInsights,
						includeCommonMistakes:
							notificationConfig.includeCommonMistakes,
						includeRelatedProblems:
							notificationConfig.includeRelatedProblems,
						includeHintsProgressive:
							notificationConfig.includeHintsProgressive,
						includeHintsApproach: notificationConfig.includeHintsApproach,
						includeHintsDataStructure:
							notificationConfig.includeHintsDataStructure,
						includeHintsAlgorithm:
							notificationConfig.includeHintsAlgorithm,
						autoSubmit: notificationConfig.autoSubmit,
						autoSubmitTime: notificationConfig.autoSubmitTime,
						autoSubmitOnlyIfSolved:
							notificationConfig.autoSubmitOnlyIfSolved,
						autoSubmitSendConfirmation:
							notificationConfig.autoSubmitSendConfirmation,
						autoSubmitConfirmationSubject:
							notificationConfig.autoSubmitConfirmationSubject,
						createdAt: notificationConfig.createdAt,
						updatedAt: notificationConfig.updatedAt,
				  }
				: null,
		};

		// Return the service with user data
		return NextResponse.json({
			data: responseData,
			message: "Provider service retrieved successfully",
		});
	} catch (error: any) {
		console.error("Error fetching provider service:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch provider service",
				message:
					error.message ||
					"An error occurred while fetching the provider service",
			},
			{ status: 500 }
		);
	}
};

export const GET = protectedRoute(getProviderServiceById);
