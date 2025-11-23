// Protected Route Middleware
// Combines authMiddleware + responseFormatMiddleware for protected routes
// Usage: export const GET = protectedRoute(handlerFunction);

import { authMiddleware } from './auth.middleware';
import { responseFormatMiddleware } from './response-format.middleware';
import { NextRequest, NextResponse } from 'next/server';

type HandlerFunction = (
  request: NextRequest,
  userId: string,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

export const protectedRoute = (handler: HandlerFunction) => {
  // Chain: authMiddleware -> responseFormatMiddleware
  // authMiddleware validates tokens and provides userId
  // responseFormatMiddleware formats the response
  const authWrapped = authMiddleware(handler);
  
  // Wrap authMiddleware with responseFormatMiddleware
  return responseFormatMiddleware(authWrapped);
};

