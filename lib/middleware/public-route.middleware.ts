// Public Route Middleware
// Wraps public routes with response format middleware only
// Usage: export const POST = publicRoute(handlerFunction);

import { NextRequest, NextResponse } from 'next/server';
import { responseFormatMiddleware } from './response-format.middleware';

type HandlerFunction = (
  request: NextRequest,
  params?: { [key: string]: string }
) => Promise<NextResponse>;

export const publicRoute = (handler: HandlerFunction) => {
  // Only apply response format middleware (no auth)
  return responseFormatMiddleware(
    async (request: NextRequest, context: { params: Promise<{ [key: string]: string }> }) => {
      const params = await context.params;
      return await handler(request, params);
    }
  );
};

