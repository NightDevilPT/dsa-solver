import bcrypt from "bcrypt"

/**
 * Generate a 6-digit OTP code
 * @returns 6-digit OTP string (e.g., "123456")
 */
export function generateOTP(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP code using bcrypt
 * @param otp - Plain OTP code to hash
 * @returns Hashed OTP string
 */
export async function hashOTP(otp: string): Promise<string> {
	const saltRounds = 10;
	return await bcrypt.hash(otp, saltRounds);
}

/**
 * Verify OTP code against hashed OTP
 * @param otp - Plain OTP code to verify
 * @param hashedOTP - Hashed OTP from database
 * @returns true if OTP matches, false otherwise
 */
export async function verifyOTP(otp: string, hashedOTP: string): Promise<boolean> {
	try {
		return await bcrypt.compare(otp, hashedOTP);
	} catch (error) {
		return false;
	}
}

/**
 * Check if OTP is expired
 * @param createdAt - OTP creation timestamp
 * @param expiryMinutes - OTP expiry time in minutes (default: 10)
 * @returns true if OTP is expired, false otherwise
 */
export function isOTPExpired(createdAt: Date, expiryMinutes: number = 10): boolean {
	const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
	return new Date() > expiryTime;
}
