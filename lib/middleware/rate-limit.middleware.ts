// Rate Limit Middleware
// Generic wrapper to apply rate limiting to API route handlers
// Follows a similar pattern to auth.middleware.ts
//
// Usage (in a route.ts file):
// import { rateLimitMiddleware } from "@/lib/middleware/rate-limit.middleware";
//
// const handler = async (req: NextRequest, params?: { [key: string]: string }) => {
//   // your route logic
// };
//
// export const GET = rateLimitMiddleware(handler, {
//   windowMs: 60_000,      // 1 minute
//   maxRequests: 5,        // 5 requests per window
//   keyPrefix: "otp-login" // optional, to scope this limiter
// });

import { NextRequest, NextResponse } from "next/server";

// Support both handler signatures for compatibility
type RouteHandler = (
	request: NextRequest,
	params?: { [key: string]: string }
) => Promise<NextResponse>;

type NextRouteHandler = (
	request: NextRequest,
	context: { params: Promise<{ [key: string]: string }> }
) => Promise<NextResponse>;

export interface RateLimitConfig {
	/**
	 * Time window in seconds (e.g. 60 for 1 minute)
	 */
	windowSeconds: number;

	/**
	 * Maximum number of requests allowed per window per key
	 */
	maxRequests: number;

	/**
	 * Optional prefix to scope rate limiting per feature (e.g. "otp-login")
	 */
	keyPrefix?: string;

	/**
	 * Optional custom key resolver.
	 * If provided, this will be used instead of the default IP+path key.
	 * You can use this to rate limit per user (e.g. by userId or email).
	 */
	keyResolver?: (
		request: NextRequest,
		params?: { [key: string]: string }
	) => string;

	/**
	 * Optional custom error message for 429 responses
	 */
	message?: string;
}

interface RateLimitState {
	count: number;
	resetAt: number;
}

// In-memory store for rate limit state
// Key: string (e.g. "otp-login:ip:/path")
// Value: { count, resetAt }
const rateLimitStore = new Map<string, RateLimitState>();

function getClientKey(req: NextRequest, prefix?: string): string {
	// Try to determine client IP (best-effort) from standard proxy headers
	const ipHeader =
		req.headers.get("x-forwarded-for") ||
		req.headers.get("x-real-ip") ||
		req.headers.get("cf-connecting-ip");
	const ip = ipHeader ? ipHeader.split(",")[0].trim() : "unknown";

	const path = req.nextUrl.pathname;
	const baseKey = `${ip}:${path}`;

	return prefix ? `${prefix}:${baseKey}` : baseKey;
}

export function rateLimitMiddleware(
	handler: RouteHandler | NextRouteHandler,
	config: RateLimitConfig
) {
	return async (
		request: NextRequest,
		context: { params: Promise<{ [key: string]: string }> }
		): Promise<NextResponse> => {
		const params = await context.params;

		try {
			const now = Date.now();

			// Resolve rate limit key
			const key = config.keyResolver
				? config.keyResolver(request, params)
				: getClientKey(request, config.keyPrefix);

			const existing = rateLimitStore.get(key);
			const windowMs = config.windowSeconds * 1000;

			if (!existing || now > existing.resetAt) {
				// New window
				rateLimitStore.set(key, {
					count: 1,
					resetAt: now + windowMs,
				});
			} else {
				// Existing window
				if (existing.count >= config.maxRequests) {
					const retryAfterSeconds = Math.max(
						0,
						Math.ceil((existing.resetAt - now) / 1000)
					);

					const errorMessage =
						config.message ||
						"Too many requests. Please try again later.";

					// Return in ApiResponse format
					const response = NextResponse.json(
						{
							data: null,
							error: errorMessage,
							message: errorMessage,
							success: false,
							statusCode: 429,
						},
						{ status: 429 }
					);

					// Optional helpful headers
					response.headers.set(
						"Retry-After",
						retryAfterSeconds.toString()
					);
					response.headers.set(
						"X-RateLimit-Limit",
						config.maxRequests.toString()
					);
					response.headers.set("X-RateLimit-Remaining", "0");

					return response;
				}

				// Increment within window
				existing.count += 1;
				rateLimitStore.set(key, existing);
			}

			// Call the actual handler - support both signatures
			// If handler accepts 2 params and second is context object, use Next.js route handler signature
			// Otherwise, use simple handler signature with params
			const response = 
				handler.length === 2
					? await (handler as NextRouteHandler)(request, context)
					: await (handler as RouteHandler)(request, params);

			// Optionally include remaining limit info for clients
			const state = rateLimitStore.get(key);
			if (state) {
				const remaining = Math.max(0, config.maxRequests - state.count);
				response.headers.set(
					"X-RateLimit-Limit",
					config.maxRequests.toString()
				);
				response.headers.set(
					"X-RateLimit-Remaining",
					remaining.toString()
				);
				response.headers.set(
					"X-RateLimit-Reset",
					Math.ceil(state.resetAt / 1000).toString()
				);
			}

			return response;
		} catch (error) {
			console.error("Rate limit middleware error:", error);
			return NextResponse.json(
				{
					data: null,
					error: "Internal server error",
					message: "An unexpected error occurred",
					success: false,
					statusCode: 500,
				},
				{ status: 500 }
			);
		}
	};
}
