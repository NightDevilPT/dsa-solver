// Verify OTP API Route
// Verify OTP code, generate tokens, set cookies
// Public route - no authentication required

import { ZodError } from 'zod';
import prisma from '@/lib/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, isOTPExpired, hashOTP } from '@/lib/utils/otp';
import { publicRoute } from '@/lib/middleware/public-route.middleware';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt-service/jwt.service';
import { verifyOTPSchema } from '@/lib/validation/otp.schema';

const verifyOTPHandler = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const { email, otpCode } = verifyOTPSchema.parse(body);

		// Normalize email
		const normalizedEmail = email.toLowerCase().trim();

		// Find user
		const user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (!user) {
			return NextResponse.json(
				{
					error: 'User not found',
					message: 'User not found. Please request a new OTP.',
				},
				{ status: 404 }
			);
		}

		// Find valid OTP token
		const otpTokens = await prisma.authToken.findMany({
			where: {
				userId: user.id,
				tokenType: 'OTP',
				isUsed: false,
				isRevoked: false,
				expiresAt: { gt: new Date() },
			},
			orderBy: { createdAt: 'desc' },
			take: 1,
		});

		if (otpTokens.length === 0) {
			return NextResponse.json(
				{
					error: 'OTP not found',
					message: 'No valid OTP found. Please request a new OTP.',
				},
				{ status: 404 }
			);
		}

		const otpToken = otpTokens[0];

		// Check if OTP is expired
		if (isOTPExpired(otpToken.createdAt, 10)) {
			await prisma.authToken.update({
				where: { id: otpToken.id },
				data: { isRevoked: true },
			});

			return NextResponse.json(
				{
					error: 'OTP expired',
					message: 'OTP has expired. Please request a new OTP.',
				},
				{ status: 400 }
			);
		}

		// Verify OTP
		const isValid = await verifyOTP(otpCode, otpToken.token);

		if (!isValid) {
			return NextResponse.json(
				{
					error: 'Invalid OTP',
					message: 'Invalid OTP code. Please try again.',
				},
				{ status: 400 }
			);
		}

		// Mark OTP as used
		await prisma.authToken.update({
			where: { id: otpToken.id },
			data: {
				isUsed: true,
				usedAt: new Date(),
			},
		});

		// Generate tokens
		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);
		const hashedRefreshToken = await hashOTP(refreshToken);

		// Store refresh token in database
		await prisma.authToken.create({
			data: {
				userId: user.id,
				token: hashedRefreshToken,
				tokenType: 'REFRESH_TOKEN',
				purpose: 'LOGIN',
				expiresAt: new Date(Date.now() + 12 * 60 * 1000), // 12 minutes
			},
		});

		// Update user email verification status
		if (!user.emailVerified) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					emailVerified: true,
					emailVerifiedAt: new Date(),
				},
			});
		}

		// Create response with user data
		const response = NextResponse.json({
			data: {
				user: {
					id: user.id,
					email: user.email,
					username: user.username,
					firstName: user.firstName,
					lastName: user.lastName,
					avatar: user.avatar,
					emailVerified: true,
				},
			},
			message: 'Login successful',
		});

		// Set HTTP-only cookies
		response.cookies.set('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 10 * 60, // 10 minutes
			path: '/',
		});

		response.cookies.set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 12 * 60, // 12 minutes
			path: '/',
		});

		return response;
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: 'Validation error',
					message: error.issues[0]?.message || 'Invalid input',
				},
				{ status: 400 }
			);
		}

		console.error('Verify OTP error:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'Failed to verify OTP',
			},
			{ status: 500 }
		);
	}
};

export const POST = publicRoute(verifyOTPHandler);

