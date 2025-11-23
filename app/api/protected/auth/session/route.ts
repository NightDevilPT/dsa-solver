// Session API Route
// Get current user session data
// Protected route - requires authentication

import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/lib/middleware/protected-route.middleware";
import prisma from "@/lib/prisma-client";

const getSessionHandler = async (request: NextRequest, userId: string) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				username: true,
				firstName: true,
				lastName: true,
				avatar: true,
				emailVerified: true,
				emailVerifiedAt: true,
				isActive: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{
					error: "User not found",
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			data: user,
			message: "Session retrieved successfully",
		});
	} catch (error) {
		console.error("Get session error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				message: "Failed to get session",
			},
			{ status: 500 }
		);
	}
};

export const GET = protectedRoute(getSessionHandler);


