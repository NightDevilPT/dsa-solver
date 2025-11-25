// Public Health Check Endpoint
// Example of public route with response format middleware

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

export const GET = publicRoute(healthCheck);
