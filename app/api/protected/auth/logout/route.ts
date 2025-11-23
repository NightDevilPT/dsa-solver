// Logout API Route
// Revoke refresh token, clear cookies, return user data
// Protected route - requires authentication

import prisma from '@/lib/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt-service/jwt.service';
import { protectedRoute } from '@/lib/middleware/protected-route.middleware';

const logoutHandler = async (request: NextRequest, userId: string) => {
	try {
		// Get refresh token from cookie
		const refreshToken = request.cookies.get('refreshToken')?.value;

		if (refreshToken) {
			try {
				// Verify refresh token to get userId
				const payload = verifyToken(refreshToken);

				// Find and revoke all refresh tokens for this user
				await prisma.authToken.updateMany({
					where: {
						userId: payload.userId,
						tokenType: 'REFRESH_TOKEN',
						isRevoked: false,
					},
					data: {
						isRevoked: true,
					},
				});
			} catch (error) {
				// Token might be expired, continue with logout anyway
				console.warn('Error revoking refresh token:', error);
			}
		}

		// Get user data before clearing cookies
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
			},
		});

		// Create response with user data
		const response = NextResponse.json({
			data: user,
			message: 'Logged out successfully',
		});

		// Clear cookies
		response.cookies.delete('accessToken');
		response.cookies.delete('refreshToken');

		return response;
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'Failed to logout',
			},
			{ status: 500 }
		);
	}
};

export const POST = protectedRoute(logoutHandler);



