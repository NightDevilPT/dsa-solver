// JWT Service
// Handles JWT token generation, verification, and decoding
// Used for accessToken and refreshToken management

import { sign, verify, decode, JwtPayload } from "jsonwebtoken";

interface TokenPayload {
	userId: string;
}

/**
 * Generate JWT access token (10 minutes expiry)
 * @param userId - User ID to encode in token
 * @returns JWT access token string
 */
export function generateAccessToken(userId: string): string {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET environment variable is not set");
	}

	return sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "10m", // 10 minutes
	});
}

/**
 * Generate JWT refresh token (12 minutes expiry)
 * @param userId - User ID to encode in token
 * @returns JWT refresh token string
 */
export function generateRefreshToken(userId: string): string {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET environment variable is not set");
	}

	return sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "12m", // 12 minutes
	});
}

/**
 * Verify JWT token and extract payload
 * @param token - JWT token string to verify
 * @returns Decoded token payload with userId
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET environment variable is not set");
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload &
			TokenPayload;
		return {
			userId: decoded.userId,
		};
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Token verification failed: ${error.message}`);
		}
		throw new Error("Token verification failed: Unknown error");
	}
}

/**
 * Decode JWT token without verification (for debugging/inspection)
 * @param token - JWT token string to decode
 * @returns Decoded token payload (may be expired or invalid)
 */
export function decodeToken(token: string): TokenPayload | null {
	try {
		const decoded = decode(token) as (JwtPayload & TokenPayload) | null;
		if (!decoded || typeof decoded !== "object") {
			return null;
		}
		return {
			userId: decoded.userId,
		};
	} catch (error) {
		return null;
	}
}

