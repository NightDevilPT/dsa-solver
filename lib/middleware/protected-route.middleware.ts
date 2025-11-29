// Protected Route Middleware
// Combines rateLimitMiddleware + authMiddleware + responseFormatMiddleware for protected routes
// Usage: export const GET = protectedRoute(handlerFunction);
// Usage with custom rate limit: export const GET = protectedRoute(handlerFunction, { windowSeconds: 60, maxRequests: 100 });

import { authMiddleware } from './auth.middleware';
import { responseFormatMiddleware } from './response-format.middleware';
import { rateLimitMiddleware, type RateLimitConfig } from './rate-limit.middleware';
import { NextRequest, NextResponse } from 'next/server';

type HandlerFunction = (
  request: NextRequest,
  userId: string,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

// Default rate limit for protected routes: 100 requests per minute (more generous for authenticated users)
const DEFAULT_PROTECTED_RATE_LIMIT: RateLimitConfig = {
  windowSeconds: 60,
  maxRequests: 100,
  keyPrefix: 'protected-api',
  message: 'Too many requests. Please try again later.',
};

export const protectedRoute = (
  handler: HandlerFunction,
  rateLimitConfig?: Partial<RateLimitConfig>
) => {
  // Merge custom rate limit config with defaults
  const rateLimit: RateLimitConfig = {
    ...DEFAULT_PROTECTED_RATE_LIMIT,
    ...rateLimitConfig,
  };

  // Chain: rateLimitMiddleware -> authMiddleware -> responseFormatMiddleware
  // authMiddleware validates tokens and provides userId
  // responseFormatMiddleware formats the response
  const authWrapped = authMiddleware(handler);
  const responseFormatted = responseFormatMiddleware(authWrapped);
  
  // Apply rate limiting (outermost wrapper)
  return rateLimitMiddleware(responseFormatted, rateLimit);
};

