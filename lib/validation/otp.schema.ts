// OTP Validation Schemas
// Zod schemas for OTP-related API requests

import { z } from 'zod';

/**
 * Login request schema
 * Validates email input for login/OTP request
 */
export const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
});

/**
 * Verify OTP request schema
 * Validates email and OTP code for OTP verification
 */
export const verifyOTPSchema = z.object({
	email: z.string().email('Invalid email format'),
	otpCode: z.string().length(6, 'OTP must be 6 digits'),
});


