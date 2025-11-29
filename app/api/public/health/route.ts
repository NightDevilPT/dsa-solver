// Public Health Check Endpoint
// Example of public route with automatic rate limiting + response format middleware

import { NextRequest, NextResponse } from "next/server";
import { publicRoute } from "@/lib/middleware/public-route.middleware";

const healthCheck = async (request: NextRequest) => {
	return NextResponse.json({
		data: {
			status: "ok",
			timestamp: new Date().toISOString(),
			service: "dsa-solver-api",
		},
		message: "Service is healthy",
	});
};

// Rate limiting is now built into publicRoute (default: 60 requests/minute)
// You can override with custom config if needed:
// export const GET = publicRoute(healthCheck, { windowSeconds: 60, maxRequests: 10, keyPrefix: "health-check" });
export const GET = publicRoute(healthCheck);
