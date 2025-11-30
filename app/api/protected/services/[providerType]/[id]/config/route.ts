// Protected Provider Service Config Update Endpoint
// PATCH /api/protected/services/[providerType]/[id]/config
// Updates or creates UserProviderService configuration

import {
	validateProviderServiceParams,
	validateUpdateServiceConfig,
} from "@/lib/validation/provider-service.schema";
import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";
import { ProviderServiceWithUserData } from "@/interface/provider-details.interface";

const updateServiceConfig = async (
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
		const bodyValidation = validateUpdateServiceConfig(body);

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

		const { serviceConfig, isEnabled } = bodyValidation.data;

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

		// Upsert UserProviderService
		const userProviderService = await prisma.userProviderService.upsert({
			where: {
				userId_providerServiceId: {
					userId: userId,
					providerServiceId: serviceId,
				},
			},
			update: {
				...(serviceConfig !== undefined && {
					serviceConfig: serviceConfig as any,
				}),
				...(isEnabled !== undefined && { isEnabled }),
				updatedAt: new Date(),
			},
			create: {
				userId: userId,
				providerServiceId: serviceId,
				serviceConfig: (serviceConfig || null) as any,
				isEnabled: isEnabled ?? false,
			},
			include: {
				notificationConfig: true,
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
		const notificationConfig =
			(userProviderService as any).notificationConfig || null;

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
				id: userProviderService.id,
				userId: userProviderService.userId,
				providerServiceId: userProviderService.providerServiceId,
				isEnabled: userProviderService.isEnabled,
				serviceConfig: userProviderService.serviceConfig as Record<
					string,
					any
				> | null,
				createdAt: userProviderService.createdAt,
				updatedAt: userProviderService.updatedAt,
			},
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
						includeAlternative:
							notificationConfig.includeAlternative,
						includeExplanationOverview:
							notificationConfig.includeExplanationOverview,
						includeExplanationApproach:
							notificationConfig.includeExplanationApproach,
						includeStepByStep: notificationConfig.includeStepByStep,
						includeKeyInsights:
							notificationConfig.includeKeyInsights,
						includeCommonMistakes:
							notificationConfig.includeCommonMistakes,
						includeRelatedProblems:
							notificationConfig.includeRelatedProblems,
						includeHintsProgressive:
							notificationConfig.includeHintsProgressive,
						includeHintsApproach:
							notificationConfig.includeHintsApproach,
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

		return NextResponse.json({
			data: responseData,
			message: "Service configuration updated successfully",
		});
	} catch (error: any) {
		console.error("Error updating service config:", error);
		return NextResponse.json(
			{
				error: "Failed to update service configuration",
				message:
					error.message ||
					"An error occurred while updating the service configuration",
			},
			{ status: 500 }
		);
	}
};

export const PATCH = protectedRoute(updateServiceConfig);
