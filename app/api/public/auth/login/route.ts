// Login API Route
// Request login: Generate OTP, create user if doesn't exist, send OTP email
// Public route - no authentication required

import { ZodError } from 'zod';
import prisma from '@/lib/prisma-client';
import { generateOTP, hashOTP } from '@/lib/utils/otp';
import { loginSchema } from '@/lib/validation/otp.schema';
import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service/email.service';
import { publicRoute } from '@/lib/middleware/public-route.middleware';
import { buildOTPEmail } from '@/lib/email-service/templates/otp-mail';

const loginHandler = async (request: NextRequest) => {
	try {
		const body = await request.json();
		const { email } = loginSchema.parse(body);

		// Normalize email (lowercase)
		const normalizedEmail = email.toLowerCase().trim();

		// Find or create user
		let user = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		const isNewUser = !user;

		if (!user) {
			// Create new user
			user = await prisma.user.create({
				data: {
					email: normalizedEmail,
					isActive: true,
				},
			});
		}

		// Generate 6-digit OTP
		const otpCode = generateOTP();
		const hashedOTP = await hashOTP(otpCode);

		// Revoke any existing OTP tokens for this user
		await prisma.authToken.updateMany({
			where: {
				userId: user.id,
				tokenType: 'OTP',
				isUsed: false,
				isRevoked: false,
			},
			data: {
				isRevoked: true,
			},
		});

		// Store hashed OTP in database (expires in 10 minutes)
		await prisma.authToken.create({
			data: {
				userId: user.id,
				token: hashedOTP,
				tokenType: 'OTP',
				purpose: 'LOGIN',
				expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
			},
		});

		// Send OTP email via email service
		try {
			const emailOptions = buildOTPEmail({
				email: normalizedEmail,
				otpCode,
				userName: user?.username || undefined,
				isNewUser,
			});
			
			await emailService.sendEmail(emailOptions);
		} catch (emailError) {
			console.error('Failed to send OTP email:', emailError);
			// Continue even if email fails (OTP is still generated and stored)
		}

		// For now, return success (in production, don't return OTP in response)
		return NextResponse.json({
			data: {
				message: isNewUser
					? 'User created. OTP sent to email.'
					: 'OTP sent to email.',
				// Remove this in production - only for development
				...(process.env.NODE_ENV === 'development' && { otpCode }),
			},
			message: 'OTP sent successfully',
		});
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

		console.error('Login error:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				message: 'Failed to process login request',
			},
			{ status: 500 }
		);
	}
};

export const POST = publicRoute(loginHandler);

