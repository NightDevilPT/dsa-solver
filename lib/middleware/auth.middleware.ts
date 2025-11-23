// Auth Middleware
// Validates accessToken and refreshToken, auto-refreshes if needed
// Supports route parameters for dynamic routes

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma-client";
import { verify, sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
	userId: string;
}

type RouteHandler = (
	request: NextRequest,
	userId: string,
	params?: { [key: string]: string }
) => Promise<NextResponse>;

export function authMiddleware(handler: RouteHandler) {
	return async (
		request: NextRequest,
		context: { params: Promise<{ [key: string]: string }> }
	): Promise<NextResponse> => {
		// Resolve params promise
		const params = await context.params;
		try {
			const accessToken = request.cookies.get("accessToken")?.value;
			const refreshToken = request.cookies.get("refreshToken")?.value;

			// Try accessToken first (no database lookup)
			if (accessToken) {
				try {
					const decoded = verify(
						accessToken,
						process.env.JWT_SECRET!
					) as JWTPayload;
					return await handler(
						request,
						decoded.userId,
						params
					);
				} catch (error) {
					// AccessToken expired, check refreshToken
				}
			}

			// AccessToken expired/invalid, check refreshToken
			if (!refreshToken) {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				);
			}

			// Verify refreshToken JWT
			let refreshPayload: JWTPayload;
			try {
				refreshPayload = verify(
					refreshToken,
					process.env.JWT_SECRET!
				) as JWTPayload;
			} catch (error) {
				return NextResponse.json(
					{ error: "Session expired" },
					{ status: 401 }
				);
			}

			// Find refreshToken in database
			const tokens = await prisma.authToken.findMany({
				where: {
					userId: refreshPayload.userId,
					tokenType: "REFRESH_TOKEN",
					isRevoked: false,
					expiresAt: { gt: new Date() },
				},
			});

			// Validate hash
			let tokenFound = false;
			let matchedToken = null;
			for (const token of tokens) {
				if (await bcrypt.compare(refreshToken, token.token)) {
					tokenFound = true;
					matchedToken = token;
					break;
				}
			}

			if (!tokenFound || !matchedToken) {
				return NextResponse.json(
					{ error: "Invalid token" },
					{ status: 401 }
				);
			}

			// Generate new tokens
			const newAccessToken = sign(
				{ userId: refreshPayload.userId },
				process.env.JWT_SECRET!,
				{ expiresIn: "10m" }
			);
			const newRefreshToken = sign(
				{ userId: refreshPayload.userId },
				process.env.JWT_SECRET!,
				{ expiresIn: "12m" }
			);
			const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);

			// Revoke old, store new
			await prisma.authToken.update({
				where: { id: matchedToken.id },
				data: { isRevoked: true },
			});
			await prisma.authToken.create({
				data: {
					userId: refreshPayload.userId,
					token: hashedRefresh,
					tokenType: "REFRESH_TOKEN",
					purpose: "LOGIN",
					expiresAt: new Date(Date.now() + 12 * 60 * 1000), // 12 minutes
				},
			});

			// Execute handler
			const response = await handler(
				request,
				refreshPayload.userId,
				params
			);

			// Set new cookies
			response.cookies.set("accessToken", newAccessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 10 * 60,
				path: "/",
			});
			response.cookies.set("refreshToken", newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 12 * 60,
				path: "/",
			});

			return response;
		} catch (error) {
			console.error("Auth middleware error:", error);
			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 }
			);
		}
	};
}
