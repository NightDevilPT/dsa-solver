// Public Route Middleware
// Wraps public routes with rate limiting + response format middleware
// Usage: export const POST = publicRoute(handlerFunction);
// Usage with custom rate limit: export const POST = publicRoute(handlerFunction, { windowSeconds: 30, maxRequests: 5 });

import { NextRequest, NextResponse } from 'next/server';
import { responseFormatMiddleware } from './response-format.middleware';
import { rateLimitMiddleware, type RateLimitConfig } from './rate-limit.middleware';

type HandlerFunction = (
  request: NextRequest,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

// Default rate limit for public routes: 60 requests per minute
const DEFAULT_PUBLIC_RATE_LIMIT: RateLimitConfig = {
  windowSeconds: 60,
  maxRequests: 60,
  keyPrefix: 'public-api',
  message: 'Too many requests. Please try again later.',
};

export const publicRoute = (
  handler: HandlerFunction,
  rateLimitConfig?: Partial<RateLimitConfig>
) => {
  // Merge custom rate limit config with defaults
  const rateLimit: RateLimitConfig = {
    ...DEFAULT_PUBLIC_RATE_LIMIT,
    ...rateLimitConfig,
  };

  // Chain: rateLimitMiddleware -> responseFormatMiddleware
  const responseFormatted = responseFormatMiddleware(
    async (request: NextRequest, context: { params: Promise<{ [key: string]: string }> }) => {
      const params = await context.params;
      return await handler(request, params);
    }
  );

  // Apply rate limiting (outermost wrapper)
  return rateLimitMiddleware(responseFormatted, rateLimit);
};

