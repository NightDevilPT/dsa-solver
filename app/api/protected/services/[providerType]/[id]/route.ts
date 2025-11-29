// Protected Provider Service by ID Endpoint
// GET /api/protected/services/[providerType]/[id]
// Returns a single provider service by ID and provider type

import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { ProviderService } from "@/interface/provider-service.interface";
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";

const getProviderServiceById = async (
	request: NextRequest,
	userId: string,
	params?: { providerType?: string; id?: string }
) => {
	try {
		const providerType = params?.providerType?.toUpperCase();
		const serviceId = params?.id;

		// Validate providerType
		if (
			!providerType ||
			!Object.values(ProviderType).includes(providerType as ProviderType)
		) {
			return NextResponse.json(
				{
					error: "Invalid provider type",
					message: `Provider type must be one of: ${Object.values(
						ProviderType
					).join(", ")}`,
				},
				{ status: 400 }
			);
		}

		// Validate serviceId
		if (!serviceId) {
			return NextResponse.json(
				{
					error: "Invalid service ID",
					message: "Service ID is required",
				},
				{ status: 400 }
			);
		}

		// Find the provider service by ID and providerType
		const service = await prisma.providerService.findFirst({
			where: {
				id: serviceId,
				providerType: providerType as ProviderType,
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

		// Return the service
		return NextResponse.json({
			data: service as ProviderService,
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
