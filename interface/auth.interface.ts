// Authentication Interfaces
// Type definitions for authentication-related data structures

export interface LoginRequest {
	email: string;
}

export interface VerifyOTPRequest {
	email: string;
	otpCode: string;
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string | null;
		emailVerified: boolean;
	};
	message: string;
}


