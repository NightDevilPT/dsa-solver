// Protected Provider Services Endpoint
// GET /api/protected/services/[providerType]?page=1&limit=10&isActive=true&isComingSoon=false
// Returns paginated list of provider services for a specific provider type

import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { ProviderType } from "@/lib/generated/prisma/enums";
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";
import { PaginatedProviderServices } from "@/interface/provider-service.interface";

const getProviderServices = async (
	request: NextRequest,
	userId: string,
	params?: { providerType?: string }
) => {
	try {
		const providerType = params?.providerType?.toUpperCase();

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

		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
		const limit = Math.min(
			50,
			Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
		);
		const isActive = searchParams.get("isActive");
		const isComingSoon = searchParams.get("isComingSoon");
		const serviceType = searchParams.get("serviceType");

		// Build where clause
		const where: any = {
			providerType: providerType as ProviderType,
		};

		if (isActive !== null) {
			where.isActive = isActive === "true";
		}

		if (isComingSoon !== null) {
			where.isComingSoon = isComingSoon === "true";
		}

		if (serviceType) {
			where.serviceType = serviceType;
		}

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Get total count and services
		const [total, services] = await Promise.all([
			prisma.providerService.count({ where }),
			prisma.providerService.findMany({
				where,
				skip,
				take: limit,
				orderBy: [{ order: "asc" }, { createdAt: "desc" }],
			}),
		]);

		// Calculate pagination metadata
		const totalPages = Math.ceil(total / limit);
		const hasMore = page < totalPages;

		const response: PaginatedProviderServices = {
			services,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasMore,
			},
		};

		return NextResponse.json({
			data: response,
			message: `Successfully retrieved ${services.length} provider service(s)`,
		});
	} catch (error: any) {
		console.error("Error fetching provider services:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch provider services",
				message:
					error.message ||
					"An error occurred while fetching provider services",
			},
			{ status: 500 }
		);
	}
};

export const GET = protectedRoute(getProviderServices);
